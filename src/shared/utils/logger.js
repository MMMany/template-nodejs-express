/* istanbul ignore file */
import { createLogger, format, transports } from "winston";
import util from "util";
import { IS_PRD, IS_TEST } from "./constants.js";

const TEST_VERBOSE = process.env.TEST_VERBOSE === "true";

const levelShort = {
  error: "E",
  warn: "W",
  info: "I",
  http: "H",
  verbose: "V",
  debug: "D",
  silly: "S",
};

const logger = createLogger({
  level: IS_PRD ? "info" : "debug",
  silent: IS_TEST && !TEST_VERBOSE,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.printf(
      /** @param {import('winston').Logform.TransformableInfo & { timestamp: string, name: string, message: string, stack: string }} info */
      ({ timestamp, level, name, message, stack, ...others }) => {
        // eslint-disable-next-line no-control-regex
        const plainLevel = level.replaceAll(/\u001b\[.*?m/g, "");
        const shortLevel = levelShort[plainLevel] || plainLevel[0].toUpperCase();
        const coloredLevel = level.replace(plainLevel, shortLevel);

        let msg = message;
        if (stack) {
          msg = IS_PRD ? `${name}: ${message}` : stack;
        }

        let extra = "";
        const splat = others[Symbol.for("splat")];
        if (Array.isArray(splat)) {
          splat.forEach((v) => {
            if (v instanceof Error) {
              extra += "\n" + (IS_PRD ? `${v.name}: ${v.message}` : v.stack);
            } else if (typeof v === "object") {
              extra += "\n" + util.inspect(v, { depth: null, colors: true, compact: true });
            } else {
              extra += ` ${v}`;
            }
          });
        }

        return `[${timestamp}][${coloredLevel}] ${msg}${extra}`.trim();
      },
    ),
  ),
  transports: [new transports.Console()],
});

export default logger;
