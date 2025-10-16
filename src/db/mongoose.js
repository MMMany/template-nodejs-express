const mongoose = require("mongoose");
const logger = require("#/shared/logger");

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

async function connectMongoose() {
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connection.on("error", (error) => {
    logger.error(`Mongoose connection error :`, error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn(`Mongoose disconnected. reconnecting...`);
    connectMongoose();
  });

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    logger.error(error);
  }
}

async function disconnectMongoose() {
  logger.warn(`Mongoose disconnect not support.`);
}

module.exports = {
  connectMongoose,
  disconnectMongoose,
};
