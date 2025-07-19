// src/db/setup.js

// import mongodb from "./mongodb.js";

/**
 * connect to all DBs
 */
async function connectAllDb() {
  // await mongodb.connect();
  // console.log("MongoDB connected");
}

/**
 * close all DBs connection
 */
async function closeAllDb() {
  // await mongodb.close();
  // console.log("MongoDB disconnected");
}

export { connectAllDb, closeAllDb };
