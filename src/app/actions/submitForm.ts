/**
 * Submit Form Server Action
 * 
 * NEW STRUCTURE: This Server Action handles submission of multiple complaint entries.
 * Each entry represents a single product complaint and is inserted as a separate record.
 * 
 * Database Schema:
 * - customer_complaint: Contains all complaint data including product info
 * 
 * The function accepts an array of FormInputData_Type and inserts each as a separate row.
 * 
 * Removed fields: complaintTypeDetails, healthConcernDetails, issueDetails
 * Renamed fields: sampleHeld → productInPossession
 * New fields: complaintSource, productFlavour, productSize, affectedUnit, bestBeforeDate
 */
"use server"

import { API_Response_Type, FormInputData_Type } from "@/types/type";
import supabase from "@/lib/supabaseClient";

// Database table name constant
const customer_complaint_table: string = "customer_complaint";

/**
 * Submits multiple form entries to the database
 * 
 * @param inputDataArray - Array of form entries, each representing one product complaint
 * @returns Promise<API_Response_Type> - Standardized response object
 */
export const submitForm = async (inputDataArray: FormInputData_Type[]): Promise<API_Response_Type> => {
  
  // Transform array of entries into database insert format
  const complaintsToInsert = inputDataArray.map(inputData => ({
    // Complaint source (Customer vs Store)
    complaintSource: inputData.complaintSource,
    
    // Customer information
    customerName: inputData.customerName,
    customerEmail: inputData.customerEmail,
    customerPhone: inputData.customerPhone,
    location: inputData.location,
    locationCustomerService: inputData.locationCustomerService,
    
    // Product information (now part of main complaint record)
    productFlavour: inputData.productFlavour,
    productSize: inputData.productSize,
    affectedUnit: inputData.affectedUnit,
    bestBeforeDate: inputData.bestBeforeDate,
    
    // Complaint details
    followUpDepartment: inputData.followUpDepartment,  // Department (QA/Customer Service/Logistics)
    issue: inputData.issue.join(";"), // Convert array to semicolon-separated string
    
    // Response and follow-up
    productInPossession: inputData.productInPossession, // Renamed from sampleHeld
    response: inputData.response,
    followUpRequired: inputData.followUpRequired,  // Yes/No for follow-up needed
    additionalNotes: inputData.additionalNotes
  }));

  // Insert all complaints in a single batch operation
  const { status, data, error } = await supabase
    .from(customer_complaint_table)
    .insert(complaintsToInsert)
    .select();

  return { status, data: data || [], error };
}

