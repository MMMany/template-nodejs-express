const { dotenvSetup } = require("./config/dotenv");
dotenvSetup();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// const sampleRouter = require("./routes/sample");
// app.use("/api/sample", sampleRouter);

app.use((req, res) => {
  console.info(`Not Found :: ${req.method} ${req.url} from ${req.ip}`);
  res.sendStatus(404);
});

const { connectAllDb, closeAllDb } = require("./db/setup");

/* istanbul ignore next */
if (NODE_ENV !== "test") {
  connectAllDb().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    function gracefulShutdown(signal) {
      console.log(`Received ${signal}. Closing server...`);
      const shutdownTimeout = setTimeout(() => {
        console.error("Could not close shutdown gracefully in 10 seconds, forcefully shutting down");
        process.exit(1);
      }, 10000);

      closeAllDb()
        .then(() => {
          clearTimeout(shutdownTimeout);
          server.close(() => {
            console.log("Server closed");
            process.exit(0);
          });
        })
        .catch((err) => {
          console.error(err);
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
