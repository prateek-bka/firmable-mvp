import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
import logger from "./src/config/logger.js";

const startServer = async () => {
  await connectDB();

  const port = config.port || 5500;

  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};

startServer();
