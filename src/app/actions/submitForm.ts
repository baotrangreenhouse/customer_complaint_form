/**
 * Submit Form Server Action
 * 
 * This Server Action handles form submission to the Supabase database.
 * It performs a two-step insert process:
 * 1. Insert main complaint data into customer_complaint table
 * 2. Insert related product data into customer_complaint_product table
 * 
 * Database Schema:
 * - customer_complaint: Main complaint information
 * - customer_complaint_product: Product details (linked by complaint_id)
 * 
 * The function handles the relational data by first inserting the complaint,
 * getting the generated ID, then inserting associated products.
 */
"use server"

import { API_Response_Type, FormInputData_Type, FormInputProduct_Type } from "@/types/type";
import supabase from "@/lib/supabaseClient";

// Database table name constants
const customer_complaint_table: string = "customer_complaint";
const customer_complaint_product_table: string = "customer_complaint_product";

/**
 * Submits form data to the database
 * 
 * @param inputData - Complete form data including customer info and products
 * @returns Promise<API_Response_Type> - Standardized response object
 */
export const submitForm = async (inputData: FormInputData_Type): Promise<API_Response_Type> => {
  
  // Step 1: Insert main complaint data
  const { status, data, error } = await supabase
    .from(customer_complaint_table)
    .insert([
      {
        // Map form fields to database columns
        customer_name: inputData.customerName,
        location: inputData.location,
        complaint_type: inputData.complaintType,
        complaint_type_details: inputData.complaintTypeDetails,
        health_concern: inputData.healthConcern,
        health_concern_details: inputData.healthConcernDetails,
        issue: inputData.issue.join(";"), // Convert array to semicolon-separated string
        issue_details: inputData.issueDetails,
        sample_held: inputData.sampleHeld,
        response: inputData.response,
        follow_up_required: inputData.followUpRequired,
        additional_notes: inputData.additionalNotes
      }
    ])
    .select(); // Return the inserted record (including generated ID)

  // Step 2: If complaint insert succeeded, insert related products
  if (!error) {
    const { status: productStatus, error: productError } = await supabase
      .from(customer_complaint_product_table)
      .insert(
        // Map each product to database record with complaint_id relationship
        inputData.product.map((product: FormInputProduct_Type) => {
          return {
            complaint_id: data[0].id, // Link to the complaint we just created
            product_flavour: product.productFlavour,
            product_size: product.productSize,
            affected_unit: product.affectedUnit,
            best_before_date: product.bestBeforeDate
          }
        })
      );
    
    // Return the product insert result
    return { status: productStatus, data: [], error: productError };
  }
  
  // Return the complaint insert error if it failed
  return { status, data: [], error };
}

