const mongoose = require("mongoose");
const logger = require("#/utils/logger");

const { IS_DEV } = require("#/utils/constants");

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DBNAME;
/* istanbul ignore if */
if ([host, port, dbName].some((it) => !it)) {
  throw new Error("MONGO_HOST, MONGO_PORT, MONGO_DBNAME is not defined");
}

const uri = `mongodb://${host}:${port}/${dbName}`;

let terminate = false;

async function connectMongoose() {
  /* istanbul ignore if */
  if (IS_DEV) {
    mongoose.set("debug", true);
  }

  /* istanbul ignore next */
  mongoose.connection.on("error", (error) => {
    logger.error(`Mongoose connection error :`, error);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn(`Mongoose disconnected. reconnecting...`);
    /* istanbul ignore if */
    if (!terminate) connectMongoose();
  });

  try {
    await mongoose.connect(uri);
  } catch (error) {
    /* istanbul ignore next */
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
