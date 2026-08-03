// Simple colorized console logger utility
export const logger = {
  info: (message, ...meta) => {
    console.log(`\x1b[32m[INFO]\x1b[0m ${message}`, ...meta);
  },
  error: (message, ...meta) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`, ...meta);
  },
  warn: (message, ...meta) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`, ...meta);
  },
  debug: (message, ...meta) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\x1b[36m[DEBUG]\x1b[0m ${message}`, ...meta);
    }
  }
};
