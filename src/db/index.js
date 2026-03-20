const { connectMongoose, disconnectMongoose } = require("./mongoose");

async function connectAllDb() {
  await connectMongoose();
}

async function closeAllDb() {
  await disconnectMongoose();
}

module.exports = { connectAllDb, closeAllDb };
