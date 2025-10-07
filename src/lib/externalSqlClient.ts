/**
 * External SQL Server Database Client
 * 
 * This module provides connection and query functionality for the external SQL Server database
 * that contains the DearCustomers table with store location information.
 * 
 * Database: DearCustomers table
 * Query: Fetch unique store names filtered by SalesRepresentative (Grocery or Foodservice)
 */

import sql from 'mssql';

/**
 * SQL Server configuration from environment variables
 * Azure SQL Server configuration
 */
const externalSqlConfig: sql.config = {
  server: process.env.EXTERNAL_SQL_HOST || '',
  port: parseInt(process.env.EXTERNAL_SQL_PORT || '1433'),
  database: process.env.EXTERNAL_SQL_DATABASE || '',
  user: process.env.EXTERNAL_SQL_USER || '',
  password: process.env.EXTERNAL_SQL_PASSWORD || '',
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

/**
 * Singleton connection pool
 */
let pool: sql.ConnectionPool | null = null;

/**
 * Get or create SQL Server connection pool
 */
async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(externalSqlConfig);
  }
  return pool;
}

/**
 * Fetch store locations from DearCustomers table
 * 
 * Query:
 * - Table: DearCustomers
 * - Column: name (store name)
 * - Filter: SalesRepresentative = 'Grocery' OR 'Foodservice'
 * - Removes duplicates
 * - Sorts alphabetically
 * 
 * @returns Promise<string[]> - Array of unique store names
 */
export async function fetchStoreLocations(): Promise<string[]> {
  try {
    // Validate configuration
    if (!process.env.EXTERNAL_SQL_HOST || !process.env.EXTERNAL_SQL_DATABASE) {
      console.error('External SQL Server credentials not configured');
      console.error('EXTERNAL_SQL_HOST:', process.env.EXTERNAL_SQL_HOST ? 'Set' : 'Missing');
      console.error('EXTERNAL_SQL_DATABASE:', process.env.EXTERNAL_SQL_DATABASE ? 'Set' : 'Missing');
      return [];
    }

    console.log('Connecting to SQL Server...');
    console.log('Host:', process.env.EXTERNAL_SQL_HOST);
    console.log('Database:', process.env.EXTERNAL_SQL_DATABASE);
    console.log('User:', process.env.EXTERNAL_SQL_USER);

    // Get connection pool
    const connectionPool = await getPool();
    console.log('Connection pool established');

    // Execute query
    const result = await connectionPool.request().query(`
      SELECT DISTINCT name
      FROM DearCustomers
      WHERE SalesRepresentative IN ('Grocery', 'Foodservice')
        AND name IS NOT NULL
        AND name != ''
      ORDER BY name ASC
    `);

    console.log('Query executed successfully');

    // Extract names from result
    const locations = result.recordset.map((record: any) => record.name);

    console.log(`Fetched ${locations.length} store locations from external database`);
    return locations;

  } catch (error) {
    console.error('Error fetching store locations from external SQL Server:');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return empty array on error to prevent form from breaking
    // The form can still function with manual entry
    return [];
  }
}

/**
 * Close the database connection pool
 * Call this when shutting down the application
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}
