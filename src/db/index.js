const { connectMongoose, disconnectMongoose } = require("./mongoose");

/**
 * connect all databases
 */
async function connectAllDb() {
  await connectMongoose();
}

/**
 * close all databases connection
 */
async function closeAllDb() {
  await disconnectMongoose();
}

module.exports = { connectAllDb, closeAllDb };
