// src/db/mongodb.js

import { MongoClient } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

class MongoDB {
  /** @type {MongoClient} */
  #client = null;

  constructor() {
    this.#client = new MongoClient(MONGODB_URL);
    this.db = this.#client.db(MONGODB_DBNAME);
    this.isConnected = false;

    this.db.createCollection("users", {});
    this.USERS = this.db.collection("users");
    this.POSTS = this.db.collection("posts");
  }

  async connect() {
    if (this.isConnected) {
      return this;
    }
    await this.client.connect();
    this.isConnected = true;
    return this;
  }

  async close() {
    if (!this.isConnected) {
      return this;
    }
    await this.client.close();
    this.isConnected = false;
    return this;
  }
}

/** @type {MongoDB | null} */
let instance = null;
if (process.env.MONGODB_URL && process.env.MONGODB_DBNAME) {
  instance = new MongoDB();
}

export default instance;
