"use client"

import { FormEvent, useState } from "react";
import TextInputSection from "./textInputSection";
import { FormInputDataType, FormInputOptionType } from "@/types/type";
import { FormInputFieldObject } from "@/types/data";
import SelectBox from "./selectInputSection";
import { SingleValue } from "react-select";


const FormInputData: FormInputDataType = {
  name: "",
  location: "",
  locationDetail: "",
  customerName: "",
  bestBeforeDate: "", // change to date later
  productSize: "",
  productFlavour: "",
  productName: "",
  issue: "",
  issueDetail: ""
};

const FormInputOption_Location: FormInputOptionType[] = [
  {value: "juice1", label: "juice1", color: "#1E1E24"}, {value: "juice2", label: "juice2", color: "#FB9F89"}
]

const FormSection = () => {
  const [inputData, setInputData] = useState<FormInputDataType>(FormInputData);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    setInputData({
      ...inputData,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  const handleSelectChangeWrapper = (name: string, selectedOptionData: string) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData
    })
  }

  return (
    <form className="flex flex-col">
      <TextInputSection {...FormInputFieldObject.name} value={inputData.name} onChange={handleChange} isError={false} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} onChange={handleSelectChangeWrapper} isError={false} />
    </form>
  )
}

export default FormSection;