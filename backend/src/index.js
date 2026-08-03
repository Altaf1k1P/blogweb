import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import { cacheManager } from "./cache/cache.manager.js";
import app from "./app.js";
import { logger } from "./utils/logger.js";

// Initialize cache manager and database connection
const bootstrap = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Initialize Redis/Fallback Cache
    await cacheManager.init();

    // 3. Start express listener
    const PORT = ENV.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap server components:', error);
    process.exit(1);
  }
};

bootstrap();