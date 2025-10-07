"use server"

import storeLocationsData from "@/../storeLocations.json";

/**
 * Server Action: Fetch Store Locations
 * 
 * Retrieves store names from the storeLocations.json file.
 * 
 * This is called when user selects "Customer Service (Grocery / Non-Greenhouse Retail Store)"
 * as the location to populate the locationCustomerService dropdown.
 * 
 * @returns Promise<{ data: string[], error: string | null }>
 */
export async function getStoreLocations(): Promise<{ data: string[], error: string | null }> {
  try {
    console.log('[Server Action] Fetching store locations from JSON file...');
    
    // storeLocationsData is already an array of strings from the JSON file
    const locations = storeLocationsData;
    
    console.log('[Server Action] Successfully loaded', locations.length, 'locations');
    
    return {
      data: locations,
      error: null
    };
  } catch (error) {
    console.error('[Server Action] Error loading store locations:');
    console.error(error);
    
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to load store locations'
    };
  }
}
