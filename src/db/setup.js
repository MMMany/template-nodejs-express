import { connectMongoose, disconnectMongoose } from "./mongoose.js";

/**
 * connect all DB
 */
export async function connectAllDb() {
  await connectMongoose();
}

/**
 * close all DB connection
 */
export async function closeAllDb() {
  await disconnectMongoose();
}
