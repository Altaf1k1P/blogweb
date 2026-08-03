import mongoose from "mongoose";

const DB_NAME = "Blogweb";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB Connected !! DB Host: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error("MONGODB Connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
