/**
 * Get Complaint Server Action
 * 
 * This is a Next.js Server Action that fetches complaint data from Supabase.
 * Server Actions run on the server and can be called from client components.
 * 
 * Functionality:
 * - Uses "use server" directive to mark as server-side function
 * - Connects to Supabase database
 * - Queries the "customer_complaint" table
 * - Returns all complaint records
 * 
 * Database structure: 1:1 model (each product is a separate complaint record)
 * 
 * Returns:
 * - status: HTTP status code from Supabase
 * - data: Array of complaint records (each includes product info)
 * - error: Error object if query fails
 */
"use server"

import supabase from "@/lib/supabaseClient"

// Database table name constant
const customer_complaint_table: string = "customer_complaint";

/**
 * Fetches all complaint records from the database
 * Each record represents one product complaint (1:1 structure)
 * @returns Promise containing status, data array, and error object
 */
export const getComplaint = async () => {
  // Query Supabase to select all records from customer_complaint table
  // Order by most recent first
  const { status, data, error } = await supabase
    .from(customer_complaint_table)
    .select('*')
    .order('created_at', { ascending: false })

  // Data is already in camelCase from database, no transformation needed
  // Each record already contains all product information inline
  const transformedData = data?.map(complaint => ({
    id: complaint.id,
    created_at: complaint.created_at,
    complaintSource: complaint.complaintSource,
    customerName: complaint.customerName,
    location: complaint.location,
    locationCustomerService: complaint.locationCustomerService,
    productFlavour: complaint.productFlavour,
    productSize: complaint.productSize,
    affectedUnit: complaint.affectedUnit,
    bestBeforeDate: complaint.bestBeforeDate,
    complaintType: complaint.complaintType,
    healthConcern: complaint.healthConcern,
    issue: typeof complaint.issue === 'string' ? complaint.issue.split(';') : complaint.issue || [],
    productInPossession: complaint.productInPossession,
    response: complaint.response,
    followUpRequired: complaint.followUpRequired,
    additionalNotes: complaint.additionalNotes
  }));

  // Log results for debugging (should be replaced with proper logging in production)
  console.log("Query status:", status);
  console.log("Retrieved complaints:", transformedData?.length || 0);
  console.log("Error (if any):", error);
  
  return { status, data: transformedData, error };
}
