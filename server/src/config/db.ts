import mongoose from "mongoose";
import { config } from "./config.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      logger.info(`Connected to database successfully!`);
    });

    mongoose.connection.on("error", (err) => {
      logger.info(`Error in connecting to database ${err}`);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    logger.error(`Failed to connect to database ${error}`);
    process.exit(1);
  }
};

export default connectDB;
