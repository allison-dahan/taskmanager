//packages/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from "zod";
import * as schema from './schema';

// Environment variable validation schema
const PostgresEnv = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Type for validated environment
type PostgresEnvType = z.infer<typeof PostgresEnv>;

// Function to validate environment variables
const validateEnv = (): PostgresEnvType => {
  try {
    return PostgresEnv.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path}: ${err.message}`).join('\n');
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
};

// Validate environment variables
const env = validateEnv();

// PostgreSQL client configuration
const postgresOptions = {
  max: env.NODE_ENV === 'production' ? 1 : 10, // Limit connections in production
  prepare: false, // Disable prepared statements for edge compatibility
  // You can add more postgres configuration options here
};

// Create postgres client
const queryClient = postgres(env.DATABASE_URL, postgresOptions);

// Create database client with schema
export const db = drizzle(queryClient, { schema });

// Export schema and types
export * from './schema';
export type DbClient = typeof db;

// Helper function to test database connection
export async function testConnection() {
  try {
    await queryClient`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Cleanup function for graceful shutdown
export async function disconnect() {
  try {
    await queryClient.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}