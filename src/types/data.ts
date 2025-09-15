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
 * 1. Customer Information: name, location
 * 2. Product Information: flavour, size, dates, quantities  
 * 3. Complaint Details: type, health concerns, issues
 * 4. Response Information: samples, actions, follow-up
 */
export const FormInputFieldObject: FormInputFieldObject_Type = {
  // === CUSTOMER INFORMATION ===
  customerName: {
    label: "Customer Name",
    name: "customerName",
    type: "text"
  },
  location: {
    label: "Location", 
    name: "location",
    type: "text"
  },
  locationCustomerService: {
    label: "Location Customer Service",
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
    type: "datetime-local"    // HTML5 date/time picker
  },
  affectedUnit: {
    label: "Number of Affected Unit",
    name: "affectedUnit",
    type: "number"           // Numeric input with controls
  },

  // === COMPLAINT DETAILS ===
  complaintType: {
    label: "Complaint Type",
    name: "complaintType",
    type: "text"
  },
  complaintTypeDetails: {
    label: "Complaint Type Details",
    name: "complaintTypeDetails",
    type: "text"
  },
  healthConcern: {
    label: "Health Concern?",
    name: "healthConcern",
    type: "text"
  },
  healthConcernDetails: {
    label: "Health Concern Details",
    name: "healthConcernDetails",
    type: "text"
  },
  issue: {
    label: "Issue",
    name: "issue",
    type: "text"             // Multi-select handled by component logic
  },
  issueDetails: {
    label: "Issue Details",
    name: "issueDetails",
    type: "text"
  },

  // === RESPONSE INFORMATION ===
  sampleHeld: {
    label: "Sample Held",
    name: "sampleHeld",
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
  // Customer information
  "customerName",
  "location", 
  "locationCustomerService",  // Only required when location is "Customer Service..."
  
  // Product information (for each product)
  "productFlavour",
  "productSize", 
  "affectedUnit",
  "bestBeforeDate",
  
  // Complaint details
  "complaintType",
  "healthConcern",
  "issue",                   // At least one issue must be selected
  
  // Response information
  "sampleHeld", 
  "response",
  "followUpRequired",
];
