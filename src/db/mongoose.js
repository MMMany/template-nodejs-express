import mongoose from "mongoose";
import logger from "#src/shared/utils/logger.js";
import { IS_DEV, IS_TEST } from "#src/shared/utils/constants.js";

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const dbName = process.env.MONGO_DBNAME;
/* istanbul ignore if */
if ([host, port, dbName].some((it) => !it)) {
  throw new Error("MONGO_HOST, MONGO_PORT, MONGO_DBNAME is not defined");
}

const uri = `mongodb://${host}:${port}/${dbName}`;

let terminate = false;

export async function connectMongoose() {
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

export async function disconnectMongoose() {
  terminate = true;
  await mongoose.disconnect();

  /* istanbul ignore next */
  if (IS_TEST) {
    const state = mongoose.connection.readyState;
    if (state !== 0) {
      const errorMsg = `FAIL: Mongoose connection was not closed properly! (state: ${state})`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    logger.info(`Mongoose connection closed successfully`);
  }
}
