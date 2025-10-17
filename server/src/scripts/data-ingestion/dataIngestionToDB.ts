import mongoose from "mongoose";
import logger from "../../config/logger.js";
import connectDB from "../../config/db.js";
import { readXmlFile } from "./readers/xmlReader.js";
import { importRecords } from "./services/recordImporter.js";

// Main function
async function main() {
  logger.info("Starting ABN data import...\n");

  try {
    // Connect to database
    await connectDB()

    // Read and parse XML file
    const xmlData = await readXmlFile();

    // Import records
    await importRecords(xmlData);

    logger.info("All done!");
  } catch (error) {
    logger.error("Import failed:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    logger.info("Database connection closed");
    process.exit(0);
  }
}

// Run the script
main();

