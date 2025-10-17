import { AbnRecord } from "../../../models/AbnRecord.js";
import logger from "../../../config/logger.js";
import { BATCH_SIZE, MAX_RECORDS } from "../../../constants/dataIngestionConstants.js";
import { extractBusinessData } from "../extractors/businessDataExtractor.js";

// Import records to MongoDB
export async function importRecords(xmlData: any) {
  try {
    // Get ABR records from XML
    const abrRecords = xmlData.Transfer.ABR;

    if (!abrRecords) {
      throw new Error("No ABR records found in XML");
    }

    const records = Array.isArray(abrRecords) ? abrRecords : [abrRecords];
    const totalRecords = Math.min(records.length, MAX_RECORDS);

    logger.info(`Found ${records.length} records in file`);
    logger.info(`Importing first ${totalRecords} records...`);

    let imported = 0;
    let skipped = 0;
    let batch: any[] = [];

    // Process records in batches
    for (let i = 0; i < totalRecords; i++) {
      const record = records[i];

      try {
        const businessData = extractBusinessData(record);
        batch.push(businessData);

        // Insert batch when it reaches BATCH_SIZE
        if (batch.length >= BATCH_SIZE) {
          await AbnRecord.insertMany(batch, { ordered: false });
          imported += batch.length;
          logger.info(`Imported ${imported}/${totalRecords} records`);
          batch = []; // Clear batch
        }
      } catch (error: any) {
        // Skip duplicate records
        if (error.code === 11000) {
          skipped++;
        } else {
          logger.error(`Error processing record ${i + 1}:`, error.message);
        }
      }
    }

    // Insert remaining records
    if (batch.length > 0) {
      try {
        await AbnRecord.insertMany(batch, { ordered: false });
        imported += batch.length;
      } catch (error: any) {
        // Handle any remaining duplicates
        if (error.writeErrors) {
          imported += batch.length - error.writeErrors.length;
          skipped += error.writeErrors.length;
        }
      }
    }

    logger.info("Import completed!");
    logger.info(`Imported: ${imported} records`);
    logger.info(`Skipped: ${skipped} records (duplicates)`);

    return { imported, skipped };
  } catch (error) {
    logger.error("Error importing records:", error);
    throw error;
  }
}

