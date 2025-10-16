const { createLogger, format, transports } = require("winston");
const util = require("util");

const isPRD = process.env.NODE_ENV === "production";

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
  level: isPRD ? "info" : "debug",
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.printf((info) => {
      // eslint-disable-next-line no-control-regex
      const plainLevel = info.level.replace(/\u001b\[.*?m/g, "");
      const shortLevel = levelShort[plainLevel] || plainLevel[0].toUpperCase();
      const coloredLevel = info.level.replace(plainLevel, shortLevel);

      if (info instanceof Error) {
        if (!isPRD) {
          info.message = info.stack;
        } else {
          info.message = `${info.name}: ${info.message}`;
        }
      }

      let extra = "";
      if (info[Symbol.for("splat")]) {
        // @ts-ignore
        info[Symbol.for("splat")].forEach((v) => {
          if (v instanceof Error) {
            extra += "\n" + (isPRD ? `${v.name}: ${v.message}` : v.stack);
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
