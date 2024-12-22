import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
       ("Connected to MongoDB");
    } else {
      throw new Error("MONGODB_URI is not defined");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  const connectionstatus = mongoose.connection.readyState;
  if (connectionstatus === 1) {
     ("Connected to MongoDB");
  }
  if (connectionstatus === 0) {
     ("Not connected to MongoDB");
  }
  if (connectionstatus === 2) {
     ("Connecting to MongoDB");
  }
};

export default connect;
