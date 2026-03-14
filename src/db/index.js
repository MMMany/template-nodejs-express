const { connectMongoose, disconnectMongoose } = require("./mongoose");

async function connectAllDb() {
  await Promise.all([connectMongoose()]);
}

async function closeAllDb() {
  await Promise.all([disconnectMongoose()]);
}

module.exports = { connectAllDb, closeAllDb };
