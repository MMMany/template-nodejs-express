require("module-alias/register");
const { dotenvSetup } = require("./config/dotenv");
dotenvSetup();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./shared/logger");

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/sample", require("./routes/sample"));
app.use("/api/auth", require("./routes/auth"));

app.use((req, res) => {
  logger.info(`Not Found :: ${req.method} ${req.url} from ${req.ip}`);
  res.sendStatus(404);
});

const { connectAllDb, closeAllDb } = require("./db/setup");

/* istanbul ignore next */
if (NODE_ENV !== "test") {
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
