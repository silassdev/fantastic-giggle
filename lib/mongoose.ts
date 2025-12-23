import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecom";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI env var");
}

declare global {
  // eslint-disable-next-line
  var mongooseGlobal: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> | null };
}
const mongooseGlobal = global as any;

if (!mongooseGlobal.mongooseGlobal) {
  mongooseGlobal.mongooseGlobal = { conn: null, promise: null };
}

async function connect() {
  if (mongooseGlobal.mongooseGlobal.conn) {
    return mongooseGlobal.mongooseGlobal.conn;
  }
  if (!mongooseGlobal.mongooseGlobal.promise) {
    mongooseGlobal.mongooseGlobal.promise = mongoose.connect(MONGODB_URI, {
      // options if needed
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }).then((m) => m);
  }
  mongooseGlobal.mongooseGlobal.conn = await mongooseGlobal.mongooseGlobal.promise;
  return mongooseGlobal.mongooseGlobal.conn;
}

export default connect;
