/* eslint-env node */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Cargar variables de entorno desde .env
//dotenv.config();
dotenv.config({ path: ".env.local" });


const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("⚠️  MONGODB_URI no está definido en el archivo .env");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

