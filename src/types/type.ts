

export type FormInputField_Type = {
  label: string,
  name: string,
  type: string,
}

export type FormInputFieldObject_Type = {
  customerName: FormInputField_Type,
  location: FormInputField_Type,
  locationCustomerService: FormInputField_Type,
  productFlavour: FormInputField_Type,
  productSize: FormInputField_Type,
  bestBeforeDate: FormInputField_Type,
  affectedUnit: FormInputField_Type,
  complaintType: FormInputField_Type,
  complaintTypeDetails: FormInputField_Type,
  healthConcern: FormInputField_Type,
  healthConcernDetails: FormInputField_Type,
  issue: FormInputField_Type,
  issueDetails: FormInputField_Type,
  sampleHeld: FormInputField_Type,
  response: FormInputField_Type,
  followUpRequired: FormInputField_Type,
  additionalNotes: FormInputField_Type
}

export type FormInputProduct_Type = {
  productFlavour: string,
  productSize: string,
  affectedUnit: string,
  bestBeforeDate: string,
}

export type FormInputData_Type = {
  customerName: string,
  location: string,
  locationCustomerService: string,
  product: FormInputProduct_Type[],
  complaintType: string,
  complaintTypeDetails: string,
  healthConcern: string,
  healthConcernDetails: string,
  issue: string[],
  issueDetails: string,
  sampleHeld: string,
  response: string,
  followUpRequired: string,
  additionalNotes: string
}


export type FormInputOption_Type = {
  value: string,
  label: string,
}



export type API_Response_Type = {
  status: Number,
  data: FormInputData_Type[],
  error: any 
}