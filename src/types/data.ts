import { FormInputFieldObject_Type } from "./type";


export const FormInputFieldObject: FormInputFieldObject_Type = {
  customerName: { // input box
    label: "Customer Name",
    name: "customerName",
    type: "text"
  },
  location: { // input box
    label: "Location",
    name: "location",
    type: "text"
  },
  productFlavour: { // select
    label: "Product Flavour",
    name: "productFlavour",
    type: "text"
  },
  productSize: { // select
    label: "Product Size",
    name: "productSize",
    type: "text"
  },
  bestBeforeDate: { // input box
    label: "Best Before Date (BBD)",
    name: "bestBeforeDate",
    type: "date"
  },
  complaintType: { // select customer complaint / store complaint
    label: "Complaint Type",
    name: "complaintType",
    type: "text"
  },
  complaintTypeDetails: { // text area
    label: "Complaint Type Details",
    name: "complaintTypeDetails",
    type: "text"
  },
  healthConcern: { // select yes/no
    label: "Health Concern?",
    name: "healthConcern",
    type: "text"
  },
  issue: { // multi select
    label: "Issue",
    name: "issue",
    type: "text"
  },
  issueDetails: { // text area
    label: "Issue Details",
    name: "issueDetails",
    type: "text"
  },
  sampleHeld: { // select yes/no
    label: "Sample Held",
    name: "sampleHeld",
    type: "text"
  },
  response: { // select
    label: "Response",
    name: "response",
    type: "text"
  },
  followUpRequired: { // select yes/no
    label: "Follow Up Required?",
    name: "followUpRequired",
    type: "text"
  },
  additionalNotes: { // text area
    label: "Additional Notes",
    name: "Additional Notes",
    type: "text"
  }
}

