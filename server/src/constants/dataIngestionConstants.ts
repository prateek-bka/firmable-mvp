import path from "node:path";

export const MAX_RECORDS = 10000; // Import 10k records
export const BATCH_SIZE = 500; // Insert 500 at a time
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // Read only first 50MB
export const XML_FILE_PATH = path.join(
  process.cwd(),
  "assets",
  "public",
  "20251015_Public01.xml",
);
