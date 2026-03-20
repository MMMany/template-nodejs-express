const { dotenvSetup } = require("./config/dotenv");
dotenvSetup();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

const { IS_TEST } = require("./utils/constants");

const PORT = process.env.PORT;

const app = express();

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", require("./modules/users").router);

app.use((req, res) => {
  logger.warn(`Unknown request :: ${req.method} ${req.url} from ${req.ip}`);
  res.sendStatus(400);
});

const { connectAllDb, closeAllDb } = require("./db");

/* istanbul ignore if */
if (!IS_TEST) {
  connectAllDb().then(() => {
    const server = app.listen(PORT, () => {
      logger.debug(`Server is running on port ${PORT}`);
    });

    function gracefulShutdown(signal) {
      logger.debug(`Received ${signal}. Closing server...`);
      const shutdownTimeout = setTimeout(() => {
        logger.error("Could not close shutdown gracefully in 10 seconds, forcefully shutting down");
        process.exit(1);
      }, 10000);

      closeAllDb()
        .then(() => {
          clearTimeout(shutdownTimeout);
          server.close(() => {
            logger.debug("Server closed");
            process.exit(0);
          });
        })
        .catch((err) => {
          logger.error(err);
          process.exit(1);
        });
    }

    const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
    signals.forEach((signal) => {
      process.on(signal, () => gracefulShutdown(signal));
    });
  });
}

module.exports = app;
