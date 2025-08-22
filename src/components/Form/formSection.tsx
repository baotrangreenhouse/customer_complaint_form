"use client"

import { FormEvent, useState } from "react";
import { FormInputData_Type, FormInputOption_Type, FormInputProduct_Type } from "@/types/type";
import { FormInputFieldObject } from "@/types/data";
import SelectBox from "./selectBox";
import { FLAVOUR, LOCATION, PRODUCT, SIZE, convertToOption, filterFlavour, filterSize, getFlavour, getSize } from "@/datas/data";
import InputBox from "./inputBox";
import { ProductObject_Type } from "@/datas/type";

const FormInputDataDefault: FormInputData_Type = {
  customerName: "",
  location: "",
  product: [{productFlavour: "", productSize: "", bestBeforeDate: ""}],
  complaintType: "",
  complaintTypeDetails: "",
  healthConcern: "",
  issue: "",
  issueDetails: "",
  sampleHeld: "",
  response: "",
  followUpRequired: "",
  additionalNotes: ""
};

const FormSection = () => {
  let FormInputOption_Location: FormInputOption_Type[] = convertToOption(LOCATION);

  const [inputData, setInputData] = useState<FormInputData_Type>(FormInputDataDefault);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    setInputData({
      ...inputData,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  const handleSelectChangeWrapper = (name: string, selectedOptionData: string | undefined) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData ? selectedOptionData : ""
    })
  }

  return (
    <form className="flex flex-col w-full space-y-3">
      <InputBox {...FormInputFieldObject.customerName} value={inputData.customerName} onChange={handleChange} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} onChange={handleSelectChangeWrapper} />
      <div className="w-full h-0.5 bg-[var(--grey-color)] mt-2" />
      {inputData.product.map((product: FormInputProduct_Type, index: number) => {
        const [FormInputOption_ProductFlavour, setFormInputOption_ProductFlavour] = useState<FormInputOption_Type[]>(convertToOption(FLAVOUR));
        const [FormInputOption_ProductSize, setFormInputOption_ProductSize] = useState<FormInputOption_Type[]>(convertToOption(SIZE));


        const handleSelectChangeWrapper_Product = (name: "productFlavour" | "productSize" | "bestBeforeDate", selectedOptionData: string | undefined) => {
          // handle change
          var newProduct = inputData.product;
          newProduct[index][name] = selectedOptionData ? selectedOptionData : "";
          setInputData({
            ...inputData,
            ["product"]: newProduct  
          })
          // handle option
          setFormInputOption_ProductFlavour(convertToOption(FLAVOUR.filter((flavour: string) => filterFlavour(flavour, product.productSize))));
          setFormInputOption_ProductSize(convertToOption(SIZE.filter((size: string) => filterSize(product.productFlavour, size))));
          console.log(product);
        }

        return (
          <div key={index}>
            <SelectBox {...FormInputFieldObject.productFlavour} options={FormInputOption_ProductFlavour} value={product.productFlavour} onChange={handleSelectChangeWrapper_Product} />
            <SelectBox {...FormInputFieldObject.productSize} options={FormInputOption_ProductSize} value={product.productSize} onChange={handleSelectChangeWrapper_Product} />
            {/* <SelectBox {...FormInputFieldObject.bestBeforeDate} options={} value={} onChange={} /> */}
          </div>
        )
      })
      
      }

    </form>
  )
}

export default FormSection;