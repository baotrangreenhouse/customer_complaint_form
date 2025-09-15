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
 * Database table: customer_complaint
 * 
 * Returns:
 * - status: HTTP status code from Supabase
 * - data: Array of complaint records
 * - error: Error object if query fails
 */
"use server"

import supabase from "@/lib/supabaseClient"

// Database table name constant
const customer_complaint_table: string = "customer_complaint";

/**
 * Fetches all complaint records from the database with related product data
 * @returns Promise containing status, data array, and error object
 */
export const getComplaint = async () => {
  // Query Supabase to select all records from customer_complaint table
  // and include related products from customer_complaint_product table
  const { status, data, error } = await supabase
    .from(customer_complaint_table)
    .select(`
      *,
      customer_complaint_product (
        id,
        product_flavour,
        product_size,
        affected_unit,
        best_before_date
      )
    `)

  // Transform the data to match our TypeScript interface
  const transformedData = data?.map(complaint => ({
    // Map database column names (snake_case) to TypeScript interface (camelCase)
    customerName: complaint.customer_name,
    location: complaint.location,
    locationCustomerService: complaint.location_customer_service || "",
    complaintType: complaint.complaint_type,
    complaintTypeDetails: complaint.complaint_type_details || "",
    healthConcern: complaint.health_concern,
    healthConcernDetails: complaint.health_concern_details || "",
    issue: complaint.issue ? complaint.issue.split(";") : [], // Convert semicolon-separated string back to array
    issueDetails: complaint.issue_details || "",
    sampleHeld: complaint.sample_held,
    response: complaint.response,
    followUpRequired: complaint.follow_up_required,
    additionalNotes: complaint.additional_notes || "",
    
    // Map the nested product data to match our FormInputData_Type structure
    product: complaint.customer_complaint_product?.map((p: any) => ({
      productFlavour: p.product_flavour,
      productSize: p.product_size,
      affectedUnit: p.affected_unit,
      bestBeforeDate: p.best_before_date
    })) || []
  }));

  // Log results for debugging (should be replaced with proper logging in production)
  console.log("Query status:", status);
  console.log("Retrieved data:", transformedData);
  console.log("Error (if any):", error);
  
  return { status, data: transformedData, error };
}
