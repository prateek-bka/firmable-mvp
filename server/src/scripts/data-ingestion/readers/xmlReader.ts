import fs from "fs";
import { createReadStream } from "fs";
import { XMLParser } from "fast-xml-parser";
import logger from "../../../config/logger.js";
import { MAX_FILE_SIZE, XML_FILE_PATH } from "../../../constants/dataIngestionConstants.js";

// Read and parse XML file - first portion for 10k records
export async function readXmlFile() {
  return new Promise((resolve, reject) => {
    try {
      logger.info("Reading XML file (first 50MB only)...");
      logger.info(`File: ${XML_FILE_PATH}`);


      if (!fs.existsSync(XML_FILE_PATH)) {
        throw new Error(`File not found: ${XML_FILE_PATH}`);
      }

      let xmlChunks: string[] = [];
      let bytesRead = 0;
      const stream = createReadStream(XML_FILE_PATH, {
        encoding: "utf-8",
        highWaterMark: 1024 * 1024 // Read 1MB at a time
      });

      stream.on("data", (chunk: string) => {
        bytesRead += Buffer.byteLength(chunk, "utf-8");
        xmlChunks.push(chunk);

        // Stop after MAX_FILE_SIZE
        if (bytesRead >= MAX_FILE_SIZE) {
          stream.destroy();
        }
      });

      stream.on("close", () => {
        logger.info(`File read successfully (${Math.round(bytesRead / 1024 / 1024)}MB)`);

        try {
          // Parse XML
          logger.info("Parsing XML...");
          let xmlContent = xmlChunks.join("");

          // Close XML
          if (!xmlContent.includes("</Transfer>")) {
            // Find last complete </ABR> tag
            const lastAbrIndex = xmlContent.lastIndexOf("</ABR>");
            if (lastAbrIndex !== -1) {
              xmlContent = xmlContent.substring(0, lastAbrIndex + 6) + "\n</Transfer>";
            }
          }

          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
          });

          const result = parser.parse(xmlContent);
          logger.info("XML parsed successfully");

          resolve(result);
        } catch (parseError) {
          reject(parseError);
        }
      });

      stream.on("error", (error) => {
        if (error.message !== "Stream destroyed") {
          reject(error);
        }
      });
    } catch (error) {
      logger.error("Error reading XML file:", error);
      reject(error);
    }
  });
}

