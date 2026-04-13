import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "#shared/utils/logger";
import { IS_TEST } from "#shared/constants";
import { connectAllDb, closeAllDb } from "#db/setup";

export const app = express();

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

import { router as usersRouter } from "#modules/users";
app.use("/api/users", usersRouter);

app.use((req, res) => {
  logger.warn(`Unknown request :: ${req.method} ${req.url} from ${req.ip}`);
  res.sendStatus(400);
});

/* istanbul ignore if */
if (!IS_TEST) {
  connectAllDb().then(() => {
    const PORT = process.env.PORT;

    const server = app.listen(PORT, () => {
      logger.debug(`Server is running on port ${PORT}`);
    });

    /**
     * @param {string} signal
     */
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
