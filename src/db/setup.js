import { connectMongoose, disconnectMongoose } from "./mongoose.js";

export async function connectAllDb() {
  await connectMongoose();
}

export async function closeAllDb() {
  await disconnectMongoose();
}
