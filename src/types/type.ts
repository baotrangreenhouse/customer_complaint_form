

export type FormInputFieldType = {
  label: string,
  name: string,
  type: string,
  placeholder: string,
  readonly: boolean
}

export type FormInputFieldObjectType = {
  name: FormInputFieldType,
  location: FormInputFieldType,
  locationDetail: FormInputFieldType,
  customerName: FormInputFieldType,
  bestBeforeDate: FormInputFieldType,
  productSize: FormInputFieldType,
  productFlavour: FormInputFieldType,
  productName: FormInputFieldType,
  issue: FormInputFieldType,
  issueDetail: FormInputFieldType 
}

export type FormInputDataType = {
  name: string,
  location: string,
  locationDetail: string,
  customerName: string,
  bestBeforeDate: string, // change to date later
  productSize: string,
  productFlavour: string,
  productName: string,
  issue: string,
  issueDetail: string
}

export type FormInputOptionType = {
  value: string,
  label: string,
  color: string
}

