import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (uri) {
    const opts = { dbName: "Credit" };  // กำหนดชื่อ database ว่า "Credit"
    const conn = await mongoose.connect(uri, opts);
    cachedDb = conn.connection;
    return cachedDb;
  }
  
  throw new Error("MongoDB URI is missing");
}
