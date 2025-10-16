const mongoose = require("mongoose");
const logger = require("#/shared/logger");

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

let terminate = false;

async function connectMongoose() {
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connection.on("error", (error) => {
    logger.error(`Mongoose connection error :`, error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn(`Mongoose disconnected. reconnecting...`);
    if (!terminate) connectMongoose();
  });

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    logger.error(error);
  }
}

async function disconnectMongoose() {
  terminate = true;
  await mongoose.disconnect();
}

module.exports = {
  connectMongoose,
  disconnectMongoose,
};
