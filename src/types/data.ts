/**
 * Form Configuration Data
 * 
 * This file contains the configuration objects that define form field properties
 * and validation rules. It serves as the central configuration for the entire form.
 * 
 * Key exports:
 * - FormInputFieldObject: Complete field configuration
 * - FormInputFieldRequired: List of required fields for validation
 */
import { FormInputData_Type, FormInputFieldObject_Type } from "./type";

/**
 * Form Field Configuration Object
 * 
 * Defines properties for each form field including labels, names, and input types.
 * This centralized configuration ensures consistency across the application.
 * 
 * Field categories:
 * 1. Complaint Source: Customer vs Store
 * 2. Customer Information: name, location
 * 3. Product Information: flavour, size, dates, quantities  
 * 4. Complaint Details: type, health concerns, issues
 * 5. Response Information: possession, actions, follow-up
 */
export const FormInputFieldObject: FormInputFieldObject_Type = {
  // === COMPLAINT SOURCE ===
  complaintSource: {
    label: "Complaint Source",
    name: "complaintSource",
    type: "text"
  },
  
  // === CUSTOMER INFORMATION ===
  customerName: {
    label: "Customer Name",
    name: "customerName",
    type: "text"
  },
  customerEmail: {
    label: "Customer Email",
    name: "customerEmail",
    type: "email"
  },
  customerPhone: {
    label: "Customer Phone Number",
    name: "customerPhone",
    type: "tel"
  },
  location: {
    label: "Location", 
    name: "location",
    type: "text"
  },
  locationCustomerService: {
    label: "Store Location",
    name: "locationCustomerService", 
    type: "text"
  },

  // === PRODUCT INFORMATION ===
  productFlavour: {
    label: "Product Flavour",
    name: "productFlavour",
    type: "text"
  },
  productSize: {
    label: "Product Size",
    name: "productSize",
    type: "text"
  },
  bestBeforeDate: {
    label: "Best Before Date (BBD)",
    name: "bestBeforeDate",
    type: "datetime-local"
  },
  affectedUnit: {
    label: "Number of Affected Units",
    name: "affectedUnit",
    type: "number"
  },

  // === COMPLAINT DETAILS ===
  followUpDepartment: {
    label: "Follow Up Department",
    name: "followUpDepartment",
    type: "text"
  },
  issue: {
    label: "Issue",
    name: "issue",
    type: "text"
  },

  // === RESPONSE INFORMATION ===
  productInPossession: {
    label: "Product Still in Possession?",
    name: "productInPossession",
    type: "text"
  },
  response: {
    label: "Response",
    name: "response", 
    type: "text"
  },
  followUpRequired: {
    label: "Follow Up Required?",
    name: "followUpRequired",
    type: "text"
  },
  additionalNotes: {
    label: "Additional Notes",
    name: "additionalNotes",
    type: "text"
  }
};

/**
 * Required Fields List
 * 
 * Defines which form fields are mandatory for form submission.
 * Used by form components to:
 * - Display asterisk (*) indicators
 * - Apply error styling for empty required fields
 * - Validate form completeness before submission
 * 
 * Note: locationCustomerService is conditionally required based on location selection
 */
export const FormInputFieldRequired: string[] = [
  // Complaint source
  "complaintSource",
  
  // Customer information
  "customerName",
  "location", 
  "locationCustomerService",  // Only required when location is "Customer Service..."
  
  // Product information
  "productFlavour",
  "productSize", 
  "affectedUnit",
  "bestBeforeDate",
  
  // Complaint details
  "followUpDepartment",      // Department selection (QA/Customer Service/Logistics)
  "issue",                   // At least one issue must be selected
  
  // Response information
  "productInPossession", 
  "response",
  "followUpRequired",        // Yes/No for follow-up needed
];
