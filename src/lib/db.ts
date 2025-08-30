// Legacy Prisma connection - to be removed after migration
// This file is kept for reference during migration
// Use the new MongoDB models instead

import { connectDB } from "./mongodb";

// Re-export MongoDB connection for compatibility
export { connectDB as db };
