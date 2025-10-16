"use client"

import { FormEvent, useEffect, useState } from "react";
import { FormInputData_Type, FormInputOption_Type } from "@/types/type";
import { FormInputFieldObject, FormInputFieldRequired } from "@/types/data";
import SelectBox, { MultiSelectBox } from "./selectBox";
import { COMPLAINT_SOURCE, FOLLOW_UP_DEPARTMENT, LOCATION, RESPONSE_ACTION, YES_NO, convertToOption, filterFlavour, filterSize, filterIssueByDepartment, FLAVOUR, SIZE} from "@/datas/data";
import InputBox from "./inputBox";
import Button from "../Button/button";
import { PlusIcon, TrashIcon } from "../Icon/icon";
import TextArea from "./textArea";
import { submitForm } from "@/app/actions/submitForm";
import ErrorModal from "../Modal/errorModal";
import SuccessModal from "../Modal/successModal";
import { getStoreLocations } from "@/app/actions/getStoreLocations";

/**
 * Default form data structure - single product per submission
 * Each form entry represents one product complaint
 */
const FormInputDataDefault: FormInputData_Type = {
  complaintSource: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  location: "",
  locationCustomerService: "",
  productFlavour: "",
  productSize: "",
  affectedUnit: "1",
  bestBeforeDate: "",
  followUpDepartment: "",
  issue: [],
  productInPossession: "",
  response: "",
  followUpRequired: "",
  additionalNotes: ""
};

// Convert constants to react-select options
const FormInputOption_ComplaintSource: FormInputOption_Type[] = convertToOption(COMPLAINT_SOURCE);
const FormInputOption_Location: FormInputOption_Type[] = convertToOption(LOCATION);
const FormInputOption_FollowUpDepartment: FormInputOption_Type[] = convertToOption(FOLLOW_UP_DEPARTMENT);
const FormInputOption_YesNo: FormInputOption_Type[] = convertToOption(YES_NO);
const FormInputOption_Response: FormInputOption_Type[] = convertToOption(RESPONSE_ACTION);

/**
 * FormSection Component
 * 
 * NEW STRUCTURE: 
 * - Complaint Source (Customer/Store) at top
 * - Each product gets its own form entry (white box)
 * - "Add Another Product" creates duplicate form
 * - Submit all entries as separate database records
 * - Dynamic store location loading from external SQL Server
 */
const FormSection = () => {
  // Array of form entries - each entry is a separate product complaint
  const [formEntries, setFormEntries] = useState<FormInputData_Type[]>([{...FormInputDataDefault}]);
  
  // Shared fields across all entries (set once, applied to all)
  const [sharedData, setSharedData] = useState({
    complaintSource: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    location: "",
    locationCustomerService: ""
  });
  
  // Product flavour/size options for each entry (dynamic filtering)
  const [formOptionsProductFlavour, setFormOptionsProductFlavour] = useState<FormInputOption_Type[][]>([convertToOption(FLAVOUR)]);
  const [formOptionsProductSize, setFormOptionsProductSize] = useState<FormInputOption_Type[][]>([convertToOption(SIZE)]);
  
  // Issue options for each entry (filtered by department)
  const [formOptionsIssue, setFormOptionsIssue] = useState<FormInputOption_Type[][]>([[]]);
  
  // Dynamic store locations from external database
  const [storeLocations, setStoreLocations] = useState<FormInputOption_Type[]>([]);
  const [loadingStoreLocations, setLoadingStoreLocations] = useState<boolean>(false);
  
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [databaseError, setDatabaseError] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successCount, setSuccessCount] = useState<number>(0);

  /**
   * Fetch store locations when location is set to Customer Service
   */
  useEffect(() => {
    const fetchLocations = async () => {
      if (sharedData.location === "Customer Service (Grocery / Non-Greenhouse Retail Store)") {
        setLoadingStoreLocations(true);
        try {
          const { data, error } = await getStoreLocations();
          
          if (error) {
            console.error('Failed to fetch store locations:', error);
            // Keep empty array - user can still type manually
            setStoreLocations([]);
          } else {
            // Convert string array to FormInputOption_Type array
            const options = convertToOption(data);
            setStoreLocations(options);
          }
        } catch (err) {
          console.error('Error fetching store locations:', err);
          setStoreLocations([]);
        } finally {
          setLoadingStoreLocations(false);
        }
      }
    };

    fetchLocations();
  }, [sharedData.location]);

  /**
   * Handle shared field changes (applies to all entries)
   */
  const handleSharedFieldChange = (name: string, value: string) => {
    const newSharedData = {
      ...sharedData,
      [name]: value
    };
    setSharedData(newSharedData);
    
    // Update all form entries with new shared data
    const updatedEntries = formEntries.map(entry => ({
      ...entry,
      [name]: value
    }));
    setFormEntries(updatedEntries);
  }

  /**
   * Handle individual entry field changes
   */
  const handleEntryFieldChange = (entryIndex: number, name: string, value: string | string[]) => {
    const updatedEntries = [...formEntries];
    updatedEntries[entryIndex] = {
      ...updatedEntries[entryIndex],
      [name]: value
    };
    setFormEntries(updatedEntries);
  }

  /**
   * Handle product-specific field changes with dynamic option filtering
   */
  const handleProductFieldChange = (entryIndex: number, name: "productFlavour" | "productSize", value: string) => {
    // Update the entry
    const updatedEntries = [...formEntries];
    updatedEntries[entryIndex] = {
      ...updatedEntries[entryIndex],
      [name]: value
    };
    setFormEntries(updatedEntries);

    // Update filtered options based on selection
    const currentEntry = updatedEntries[entryIndex];
    
    // Update flavour options based on size
    const newFlavourOptions = [...formOptionsProductFlavour];
    newFlavourOptions[entryIndex] = convertToOption(
      FLAVOUR.filter((flavour: string) => filterFlavour(flavour, currentEntry.productSize))
    );
    setFormOptionsProductFlavour(newFlavourOptions);
    
    // Update size options based on flavour
    const newSizeOptions = [...formOptionsProductSize];
    newSizeOptions[entryIndex] = convertToOption(
      SIZE.filter((size: string) => filterSize(currentEntry.productFlavour, size))
    );
    setFormOptionsProductSize(newSizeOptions);
  }

    /**
   * Handle follow-up department change with cascading issue options
   */
  const handleDepartmentChange = (entryIndex: number, name: string, value: string) => {
    // Update the entry with new department
    const updatedEntries = [...formEntries];
    updatedEntries[entryIndex] = {
      ...updatedEntries[entryIndex],
      [name]: value,
      issue: [] // Clear issues when department changes
    };
    setFormEntries(updatedEntries);

    // Update issue options based on selected department
    const newIssueOptions = [...formOptionsIssue];
    const departmentIssues = filterIssueByDepartment(value);
    newIssueOptions[entryIndex] = convertToOption(departmentIssues);
    setFormOptionsIssue(newIssueOptions);
  }

  /**
   * Add a new product form entry
   */
  const handleAddProduct = () => {
    const newEntry: FormInputData_Type = {
      ...FormInputDataDefault,
      // Copy shared fields to new entry
      complaintSource: sharedData.complaintSource,
      customerName: sharedData.customerName,
      customerEmail: sharedData.customerEmail,
      customerPhone: sharedData.customerPhone,
      location: sharedData.location,
      locationCustomerService: sharedData.locationCustomerService
    };
    
    setFormEntries([...formEntries, newEntry]);
    setFormOptionsProductFlavour([...formOptionsProductFlavour, convertToOption(FLAVOUR)]);
    setFormOptionsProductSize([...formOptionsProductSize, convertToOption(SIZE)]);
    setFormOptionsIssue([...formOptionsIssue, []]);
  }

  /**
   * Remove a product form entry
   */
  const handleRemoveProduct = (entryIndex: number) => {
    if (formEntries.length === 1) {
      setErrorMessage("You must have at least one product entry");
      return;
    }
    
    setFormEntries(formEntries.filter((_, index) => index !== entryIndex));
    setFormOptionsProductFlavour(formOptionsProductFlavour.filter((_, index) => index !== entryIndex));
    setFormOptionsProductSize(formOptionsProductSize.filter((_, index) => index !== entryIndex));
    setFormOptionsIssue(formOptionsIssue.filter((_, index) => index !== entryIndex));
  }

  /**
   * Submit all form entries
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate all entries
    const hasErrors = formEntries.some(entry => checkInputData(entry));
    setIsError(hasErrors);
    
    if (hasErrors) {
      setErrorMessage("Please fill in all required fields correctly and ensure email/phone formats are valid");
      return;
    }

    // Submit all entries (pass as array)
    const {status, data, error} = await submitForm(formEntries);
    
    if (!error) {
      console.log(`Successfully submitted ${formEntries.length} product complaint(s)`, status, data);
      
      // Show success modal
      setSuccessCount(formEntries.length);
      setShowSuccessModal(true);
      
      // Reset form
      setFormEntries([{...FormInputDataDefault}]);
      setSharedData({
        complaintSource: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        location: "",
        locationCustomerService: ""
      });
      setFormOptionsProductFlavour([convertToOption(FLAVOUR)]);
      setFormOptionsProductSize([convertToOption(SIZE)]);
      setFormOptionsIssue([[]]);
      setErrorMessage("");
      setIsError(false);
      setDatabaseError(null);
    }
    
    if (error) {
      console.error("Database error:", error);
      setDatabaseError(error);
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    // Clear error message when form changes
    setErrorMessage("");
  }, [formEntries, sharedData])

  return (
    <form className="flex flex-col w-full space-y-6" onSubmit={handleSubmit}>
      
      {/* Complaint Source - At the very top */}
      <div className="bg-white p-6 shadow-greenhouse">
        <Header text="Complaint Source" />
        <div className="mt-4">
          <SelectBox 
            {...FormInputFieldObject.complaintSource}
            options={FormInputOption_ComplaintSource}
            value={sharedData.complaintSource}
            isError={isError}
            onChange={handleSharedFieldChange}
          />
        </div>
      </div>

      {/* Section 1: Information (Shared across all products) */}
      <div className="bg-white p-6 shadow-greenhouse">
        <Header text="1. Customer Information" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          <InputBox 
            {...FormInputFieldObject.customerName}
            value={sharedData.customerName}
            isError={isError}
            onChange={(e: FormEvent<HTMLFormElement>) => handleSharedFieldChange(e.currentTarget.name, e.currentTarget.value)}
          />
          <InputBox 
            {...FormInputFieldObject.customerEmail}
            value={sharedData.customerEmail}
            isError={isError}
            onChange={(e: FormEvent<HTMLFormElement>) => handleSharedFieldChange(e.currentTarget.name, e.currentTarget.value)}
          />
          <InputBox 
            {...FormInputFieldObject.customerPhone}
            value={sharedData.customerPhone}
            isError={isError}
            onChange={(e: FormEvent<HTMLFormElement>) => handleSharedFieldChange(e.currentTarget.name, e.currentTarget.value)}
          />
          <SelectBox 
            {...FormInputFieldObject.location}
            options={FormInputOption_Location}
            value={sharedData.location}
            isError={isError}
            onChange={handleSharedFieldChange}
          />
        </div>
        
        {sharedData.location === "Customer Service (Grocery / Non-Greenhouse Retail Store)" && (
          <div className="mt-4">
            {loadingStoreLocations ? (
              <div className="text-sm text-[var(--text-secondary)] p-3 bg-[var(--pale-green)] bg-opacity-10">
                Loading store locations from database...
              </div>
            ) : (
              <SelectBox 
                {...FormInputFieldObject.locationCustomerService}
                options={storeLocations}
                value={sharedData.locationCustomerService}
                isError={isError}
                onChange={handleSharedFieldChange}
                isSearchable={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Product Entries - Each in its own white box */}
      <div className="space-y-6">
        {/* Section Header with Add Button */}
        <div className="bg-white p-6 shadow-greenhouse">
          <div className="flex items-center justify-between">
            <Header text="2. Product Information & Complaint Details" />
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleAddProduct}
              className="flex items-center gap-2"
            >
              <PlusIcon />
              <span className="text-sm font-semibold">Add Another Product</span>
            </Button>
          </div>
        </div>

        {formEntries.map((entry, entryIndex) => (
          <div key={entryIndex} className="bg-white p-6 shadow-greenhouse">
            <div className="flex items-center justify-between mb-4">
              <SubHeader text={`Product ${entryIndex + 1}`} />
              {formEntries.length > 1 && (
                <Button 
                  type="button" 
                  variant="danger" 
                  onClick={() => handleRemoveProduct(entryIndex)}
                  className="flex items-center gap-2"
                >
                  <TrashIcon />
                  <span className="text-sm font-semibold">Remove</span>
                </Button>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Product & Complaint */}
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-sm font-bold text-[var(--olive-green)] uppercase tracking-wide">Product Details</p>
                  <SelectBox 
                    {...FormInputFieldObject.productFlavour}
                    options={formOptionsProductFlavour[entryIndex]}
                    value={entry.productFlavour}
                    isError={isError}
                    onChange={(name: string, value: string) => handleProductFieldChange(entryIndex, "productFlavour", value)}
                  />
                  <SelectBox 
                    {...FormInputFieldObject.productSize}
                    options={formOptionsProductSize[entryIndex]}
                    value={entry.productSize}
                    isError={isError}
                    onChange={(name: string, value: string) => handleProductFieldChange(entryIndex, "productSize", value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputBox 
                      {...FormInputFieldObject.affectedUnit}
                      value={entry.affectedUnit}
                      isError={isError}
                      onChange={(e: FormEvent<HTMLFormElement>) => 
                        handleEntryFieldChange(entryIndex, e.currentTarget.name, e.currentTarget.value)
                      }
                    />
                    <InputBox 
                      {...FormInputFieldObject.bestBeforeDate}
                      value={entry.bestBeforeDate}
                      isError={isError}
                      onChange={(e: FormEvent<HTMLFormElement>) => 
                        handleEntryFieldChange(entryIndex, e.currentTarget.name, e.currentTarget.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-[var(--olive-green)] uppercase tracking-wide">Complaint Details</p>
                  <SelectBox 
                    {...FormInputFieldObject.followUpDepartment}
                    options={FormInputOption_FollowUpDepartment}
                    value={entry.followUpDepartment}
                    isError={isError}
                    onChange={(name: string, value: string) => handleDepartmentChange(entryIndex, name, value)}
                  />
                  <MultiSelectBox 
                    {...FormInputFieldObject.issue}
                    options={formOptionsIssue[entryIndex] || []}
                    value={entry.issue}
                    isError={isError}
                    onChange={(name: string, value: string[]) => handleEntryFieldChange(entryIndex, name, value)}
                  />
                </div>
              </div>

              {/* Right Column: Response & Follow-up */}
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-sm font-bold text-[var(--olive-green)] uppercase tracking-wide">Response</p>
                  <SelectBox 
                    {...FormInputFieldObject.productInPossession}
                    options={FormInputOption_YesNo}
                    value={entry.productInPossession}
                    isError={isError}
                    onChange={(name: string, value: string) => handleEntryFieldChange(entryIndex, name, value)}
                  />
                  <SelectBox 
                    {...FormInputFieldObject.response}
                    options={FormInputOption_Response}
                    value={entry.response}
                    isError={isError}
                    onChange={(name: string, value: string) => handleEntryFieldChange(entryIndex, name, value)}
                  />
                  <SelectBox 
                    {...FormInputFieldObject.followUpRequired}
                    options={FormInputOption_YesNo}
                    value={entry.followUpRequired}
                    isError={isError}
                    onChange={(name: string, value: string) => handleEntryFieldChange(entryIndex, name, value)}
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-[var(--olive-green)] uppercase tracking-wide">Additional Notes</p>
                  <TextArea 
                    {...FormInputFieldObject.additionalNotes}
                    value={entry.additionalNotes}
                    isError={isError}
                    onChange={(e: FormEvent<HTMLFormElement>) => 
                      handleEntryFieldChange(entryIndex, e.currentTarget.name, e.currentTarget.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col space-y-4 pt-4">
        <Button type="submit" variant="secondary" className="w-full py-4 text-lg">
          <span className="font-bold uppercase tracking-wide">
            Submit {formEntries.length > 1 ? `${formEntries.length} Complaints` : 'Complaint'}
          </span>
        </Button>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        complaintsCount={successCount}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={databaseError}
      />
    </form>
  )
}

export default FormSection;

/**
 * Section header component
 */
interface HeaderProps {
  text: string
}
const Header = ({text}: HeaderProps) => {
  return (
    <div className="text-[var(--text-primary)] text-2xl font-bold">
      {text}
    </div>
  )
}

/**
 * Subsection header component
 */
const SubHeader = ({text}: HeaderProps) => {
  return (
    <div className="text-[var(--text-primary)] text-xl font-semibold">
      {text}
    </div>
  )
}

/**
 * Validation helper - checks if a single entry has all required fields
 */
const checkInputData = (inputData: FormInputData_Type): boolean => {
  let isError = false;
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone validation regex
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  
  for (const field of FormInputFieldRequired) {
    // Skip locationCustomerService unless location requires it
    if (field === "locationCustomerService" && 
        inputData.location !== "Customer Service (Grocery / Non-Greenhouse Retail Store)") {
      continue;
    }
    
    // Check multi-select fields (issue)
    if (field === "issue") {
      isError = isError || inputData.issue.length === 0;
    } 
    // Check all other fields
    else {
      const value = inputData[field as keyof FormInputData_Type];
      if (typeof value === 'string') {
        isError = isError || value.trim() === "";
      }
    }
    
    // Early return if error found
    if (isError) {
      return true;
    }
  }
  
  // Validate email format if email is provided
  if (inputData.customerEmail && !emailRegex.test(inputData.customerEmail)) {
    return true;
  }
  
  // Validate phone format if phone is provided
  if (inputData.customerPhone && !phoneRegex.test(inputData.customerPhone)) {
    return true;
  }
  
  return isError;
}
