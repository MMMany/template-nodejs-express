const { connectMongoose, disconnectMongoose } = require("./mongoose");

async function connectAllDb() {
  /**
   * connect all DBs here
   */
  await Promise.all([connectMongoose()]);
}

/**
 * close all DBs connection
 */
async function closeAllDb() {
  /**
   * class all DBs here
   */
  await Promise.all([disconnectMongoose()]);
}

module.exports = { connectAllDb, closeAllDb };
