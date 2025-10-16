
/**
 * TypeScript Type Definitions
 * 
 * This file contains all the TypeScript interfaces and types used throughout
 * the application. These types ensure type safety and provide clear contracts
 * for data structures.
 * 
 * Key types:
 * - Form field definitions and configurations
 * - Product data structure
 * - Complete form data structure  
 * - API response format
 * - Select option format for react-select
 */

/**
 * Basic form field definition
 * Used to configure form field properties and behavior
 */
export type FormInputField_Type = {
  label: string,  // Display text for the field
  name: string,   // HTML name attribute and form key
  type: string,   // HTML input type (text, number, datetime-local, etc.)
}

/**
 * Complete form field configuration object
 * Maps all form fields to their configurations
 * Used for consistent field setup across components
 */
export type FormInputFieldObject_Type = {
  complaintSource: FormInputField_Type,  // Customer vs Store
  customerName: FormInputField_Type,
  customerEmail: FormInputField_Type,
  customerPhone: FormInputField_Type,
  location: FormInputField_Type,
  locationCustomerService: FormInputField_Type,
  productFlavour: FormInputField_Type,
  productSize: FormInputField_Type,
  bestBeforeDate: FormInputField_Type,
  affectedUnit: FormInputField_Type,
  followUpDepartment: FormInputField_Type,  // Department: QA/Customer Service/Logistics
  issue: FormInputField_Type,
  productInPossession: FormInputField_Type,  // Renamed from sampleHeld
  response: FormInputField_Type,
  followUpRequired: FormInputField_Type,     // Yes/No - does this need follow up?
  additionalNotes: FormInputField_Type
}

/**
 * Product information structure
 * Represents a single product involved in a complaint
 * Multiple products can be associated with one complaint
 */
export type FormInputProduct_Type = {
  productFlavour: string,   // Product flavor/type (e.g., "Adaptogenic Cafe Latte")
  productSize: string,      // Size variant (e.g., "300 mL", "946 mL")
  affectedUnit: string,     // Number of units affected
  bestBeforeDate: string,   // Best before date from product packaging
}

/**
 * Complete form data structure
 * Represents all information collected in a customer complaint form
 * NEW STRUCTURE: Each product submission creates a separate complaint entry
 */
export type FormInputData_Type = {
  // Database fields (optional - only present when fetched from DB)
  id?: number,
  created_at?: string,
  updated_at?: string,
  
  // Complaint source
  complaintSource: string,  // "Customer" or "Store"
  
  // Customer information
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  location: string,
  locationCustomerService: string,
  
  // Product information (single product per complaint now)
  productFlavour: string,
  productSize: string,
  affectedUnit: string,
  bestBeforeDate: string,
  
  // Complaint details
  followUpDepartment: string,          // Department: QA, Customer Service, or Logistics
  issue: string[],                      // Array of issues (multi-select, filtered by department)
  
  // Response and follow-up
  productInPossession: string,  // Renamed from sampleHeld
  response: string,
  followUpRequired: string,             // Yes/No - does this need follow up?
  additionalNotes: string
}

/**
 * Select option format for react-select component
 * Standardizes the option structure for all dropdown/select components
 */
export type FormInputOption_Type = {
  value: string,  // The actual value used in form submission
  label: string,  // The display text shown to users
}

/**
 * API response structure
 * Standardizes the response format from server actions
 * Used for consistent error handling and data processing
 */
export type API_Response_Type = {
  status: Number,                    // HTTP status code
  data: FormInputData_Type[],       // Response data (array of complaint records)
  error: any                        // Error object if operation failed
}