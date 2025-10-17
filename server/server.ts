import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";
import logger from "./src/config/logger";

const startServer = async () => {
  await connectDB();

  const port = config.port || 5500;

  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};

startServer();
