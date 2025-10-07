"use server"

import { fetchStoreLocations } from "@/lib/externalSqlClient";

/**
 * Server Action: Fetch Store Locations
 * 
 * Retrieves unique store names from the external DearCustomers SQL Server database.
 * Filters by SalesRepresentative (Grocery or Foodservice).
 * 
 * This is called when user selects "Customer Service (Grocery / Non-Greenhouse Retail Store)"
 * as the location to populate the locationCustomerService dropdown.
 * 
 * @returns Promise<{ data: string[], error: string | null }>
 */
export async function getStoreLocations(): Promise<{ data: string[], error: string | null }> {
  try {
    console.log('[Server Action] Fetching store locations...');
    
    const locations = await fetchStoreLocations();
    
    console.log('[Server Action] Successfully fetched', locations.length, 'locations');
    
    return {
      data: locations,
      error: null
    };
  } catch (error) {
    console.error('[Server Action] Error fetching store locations:');
    console.error(error);
    
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch store locations'
    };
  }
}
