"use client"

import { FormEvent, useState } from "react";
import TextInputSection from "./textInputSection";


const InputAccessories = {
  name: {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Your Name",
    readonly: false
  },
  location: {
    label: "Location",
    name: "location",
    type: "text",
    placeholder: "Location",
    readonly: false
  },
  locationDetail: {
    label: "Location Detail",
    name: "locationDetail",
    type: "text",
    placeholder: "Location Detail",
    readonly: false
  },
  customerName: {
    label: "Customer Name",
    name: "customerName",
    type: "text",
    placeholder: "Customer Name",
    readonly: false
  },
  bestBeforeDate: {
    label: "BBD",
    name: "bestBeforeDate",
    type: "date",
    placeholder: "BBD",
    readonly: false
  },
  productSize: {
    label: "Product Size",
    name: "productSize",
    type: "text",
    placeholder: "Product Size",
    readonly: false
  },
  productFlavour: {
    label: "Product Flavour",
    name: "productFlavour",
    type: "text",
    placeholder: "Product Flavour",
    readonly: false
  },
  productName: {
    label: "Product Name",
    name: "productName",
    type: "text",
    placeholder: "Product Name",
    readonly: false
  },
  issue: {
    label: "Issue",
    name: "issue",
    type: "text",
    placeholder: "Issue",
    readonly: false
  },
  issueDetail: {
    label: "Issue Detail",
    name: "issueDetail",
    type: "text",
    placeholder: "Issue Detail",
    readonly: false
  }
}


type Input = {
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


const FormSection = () => {
  
  const [input, setInput] = useState<Input>({name: "", location: ""});
  

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  return (
    <form className="flex flex-col">
      <TextInputSection {...InputAccessories.name} value={input.name} onChange={handleChange} isError={false} />

    </form>
  )
}

export default FormSection;