const mongoose = require("mongoose");

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

async function connectMongoose() {
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connection.on("error", (error) => {
    console.error(`Mongoose connection error :`, error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log(`Mongoose disconnected. reconnecting...`);
    connectMongoose();
  });

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.log(error);
  }
}

async function disconnectMongoose() {
  console.warn(`Mongoose disconnect not support.`);
}

module.exports = {
  connectMongoose,
  disconnectMongoose,
};
