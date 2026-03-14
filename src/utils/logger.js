const { createLogger, format, transports } = require("winston");
const util = require("util");

const { IS_PRD, IS_TEST } = require("./constants");

const levelShort = {
  error: "E",
  warn: "W",
  info: "I",
  http: "H",
  verbose: "V",
  debug: "D",
  silly: "S",
};

/* istanbul ignore next */
const logger = createLogger({
  level: IS_PRD ? "info" : "debug",
  silent: IS_TEST,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.printf((info) => {
      // eslint-disable-next-line no-control-regex
      const plainLevel = info.level.replace(/\u001b\[.*?m/g, "");
      const shortLevel = levelShort[plainLevel] || plainLevel[0].toUpperCase();
      const coloredLevel = info.level.replace(plainLevel, shortLevel);

      if (info instanceof Error) {
        info.message = IS_PRD ? `${info.name}: ${info.message}` : info.stack;
      }

      let extra = "";
      if (info[Symbol.for("splat")]) {
        // @ts-ignore
        info[Symbol.for("splat")].forEach((v) => {
          if (v instanceof Error) {
            extra += "\n" + (IS_PRD ? `${v.name}: ${v.message}` : v.stack);
          } else if (typeof v === "object") {
            extra += "\n" + util.inspect(v, { depth: null, colors: true, compact: true });
          } else {
            extra += ` ${v}`;
          }
        });
      }

      return `[${info.timestamp}][${coloredLevel}] ${info.message}${extra}`.trim();
    }),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
