import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "mocha_event_2",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
