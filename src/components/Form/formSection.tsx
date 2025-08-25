"use client"

import { FormEvent, useState } from "react";
import { FormInputData_Type, FormInputOption_Type, FormInputProduct_Type } from "@/types/type";
import { FormInputFieldObject } from "@/types/data";
import SelectBox, { MultiSelectBox } from "./selectBox";
import { COMPLAINT_TYPE, FLAVOUR, ISSUE, LOCATION, RESPONSE_ACTION, SIZE, YES_NO, convertToOption, filterFlavour, filterSize} from "@/datas/data";
import InputBox from "./inputBox";
import Button from "../Button/button";
import { PlusIcon, TrashIcon } from "../Icon/icon";
import TextArea from "./textArea";

const FormInputDataProductDefault: FormInputProduct_Type = {
  productFlavour: "", productSize: "", bestBeforeDate: "", affectedUnit: "1"
};

const FormInputDataDefault: FormInputData_Type = {
  customerName: "",
  location: "",
  product: [{... FormInputDataProductDefault}], // copy by value
  complaintType: "",
  complaintTypeDetails: "",
  healthConcern: "",
  healthConcernDetails: "",
  issue: [],
  issueDetails: "",
  sampleHeld: "",
  response: "",
  followUpRequired: "",
  additionalNotes: ""
};

const FormSection = () => {
  const FormInputOption_Location: FormInputOption_Type[] = convertToOption(LOCATION);
  const FormInputOption_ComplaintType: FormInputOption_Type[] = convertToOption(COMPLAINT_TYPE);
  const FormInputOption_YesNo: FormInputOption_Type[] = convertToOption(YES_NO);
  const FormInputOption_Issue: FormInputOption_Type[] = convertToOption(ISSUE);
  const FormInputOption_Response: FormInputOption_Type[] = convertToOption(RESPONSE_ACTION);

  const [inputData, setInputData] = useState<FormInputData_Type>(FormInputDataDefault);

  const [FormInputOption_ProductFlavour, setFormInputOption_ProductFlavour] = useState<FormInputOption_Type[][]>([convertToOption(FLAVOUR)]);
  const [FormInputOption_ProductSize, setFormInputOption_ProductSize] = useState<FormInputOption_Type[][]>([convertToOption(SIZE)]);

  // handleInputBoxChange is for input box
  const handleInputBoxChange = (event: FormEvent<HTMLFormElement>) => {
    setInputData({
      ...inputData,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  // handleSelectBoxChangeWrapper is for the select box
  const handleSelectBoxChangeWrapper = (name: string, selectedOptionData: string) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData
    })
  }
  // handleMultiSelectBoxChangeWrapper is for the multi select box
  const handleMultiSelectBoxChangeWrapper = (name: string, selectedOptionData: string[]) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData
    })
  }
  // handleClickAddProduct, handleClickRemoveProduct is for adding and removing the number of products in a complaint form
  const handleClickAddProduct = (index: number) => {
    // add to product
    const newProduct: FormInputProduct_Type[] = [
      ...inputData.product.slice(0, index + 1),
      {...FormInputDataProductDefault},
      ...inputData.product.slice(index + 1),
    ];
    setInputData({
      ...inputData,
      product: newProduct,
    });
    // add to option
    // flavour
    const newFlavourOption: FormInputOption_Type[][] = [
      ...FormInputOption_ProductFlavour.slice(0, index + 1),
      convertToOption(FLAVOUR),
      ...FormInputOption_ProductFlavour.slice(index + 1),
    ];
    setFormInputOption_ProductFlavour(newFlavourOption);
    // size
    const newSizeOption: FormInputOption_Type[][] = [
      ...FormInputOption_ProductSize.slice(0, index + 1),
      convertToOption(SIZE),
      ...FormInputOption_ProductSize.slice(index + 1),
    ];
    setFormInputOption_ProductSize(newSizeOption);
  }
  const handleClickRemoveProduct = (index: number) => {
    // delete product
    const newProduct: FormInputProduct_Type[] = inputData.product.filter((_, i) => i !== index);
    setInputData({
      ...inputData,
      product: newProduct,
    });
    // delete option
    const newFlavourOption: FormInputOption_Type[][] = FormInputOption_ProductFlavour.filter((_, i) => i !== index);
    setFormInputOption_ProductFlavour(newFlavourOption);
    const newSizeOption: FormInputOption_Type[][] = FormInputOption_ProductSize.filter((_, i) => i !== index);
    setFormInputOption_ProductSize(newSizeOption);
  }

  const handleSubmit = () => {
    console.log(inputData);
  }
  return (
    <form className="flex flex-col w-full space-y-3">
      <Header text="1. Information" />
      <InputBox {...FormInputFieldObject.customerName} value={inputData.customerName} onChange={handleInputBoxChange} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} onChange={handleSelectBoxChangeWrapper} />

      <Line />
      <Header text="2. Product" />
      {inputData.product.map((product: FormInputProduct_Type, index: number) => {
        const handleInputBoxChange_Product = (event: FormEvent<HTMLFormElement>) => {
          // handle change for bestBeforeDate, affectedUnit
          var newProduct: FormInputProduct_Type[] = [...inputData.product];
          const name: "bestBeforeDate" | "affectedUnit" = event.currentTarget.name as any;
          newProduct[index][name] = event.currentTarget.value;
          setInputData({
            ...inputData,
            product: newProduct
          })
        }
        const handleSelectBoxChangeWrapper_Product = (name: "productFlavour" | "productSize" | "bestBeforeDate", selectedOptionData: string) => {
          // handle change for productFlavour, productSize
          var newProduct: FormInputProduct_Type[] = [...inputData.product];
          newProduct[index][name] = selectedOptionData;
          setInputData({
            ...inputData,
            product: newProduct  
          })
          // handle option
          var newFlavourOption: FormInputOption_Type[][] = FormInputOption_ProductFlavour;
          newFlavourOption[index] = convertToOption(FLAVOUR.filter((flavour: string) => filterFlavour(flavour, product.productSize)));
          setFormInputOption_ProductFlavour(newFlavourOption);
          var newSizeOption: FormInputOption_Type[][] = FormInputOption_ProductSize;
          newSizeOption[index] = convertToOption(SIZE.filter((size: string) => filterSize(product.productFlavour, size)))
          setFormInputOption_ProductSize(newSizeOption);
        }
        return (
          <div key={index} className="flex flex-col w-full space-y-3">
            <SubHeader text={`Product ${index + 1}`} />
            <SelectBox {...FormInputFieldObject.productFlavour} options={FormInputOption_ProductFlavour[index]} value={product.productFlavour} onChange={handleSelectBoxChangeWrapper_Product} />
            <SelectBox {...FormInputFieldObject.productSize} options={FormInputOption_ProductSize[index]} value={product.productSize} onChange={handleSelectBoxChangeWrapper_Product} />
            <div className="grid grid-cols-2 gap-2">
              <InputBox {...FormInputFieldObject.affectedUnit} value={product.affectedUnit} onChange={handleInputBoxChange_Product} />
              <InputBox {...FormInputFieldObject.bestBeforeDate} value={product.bestBeforeDate} onChange={handleInputBoxChange_Product} />
            </div>
            <div className="flex flex-row space-x-2">
              <Button className="bg-[var(--dark-green-color)]" onClick={handleClickAddProduct} index={index}>
                <span className="text-white block h-fit w-fit p-1.5">
                  <PlusIcon />
                </span>
              </Button>
              <Button className="bg-[var(--red-color)]" onClick={handleClickRemoveProduct} index={index}>
                <span className="text-white block h-fit w-fit p-1.5">
                  <TrashIcon />
                </span>
              </Button>
            </div>
          </div>
        )
      })
      }

      <Line />
      <Header text="3. Details" />
      <SelectBox {...FormInputFieldObject.complaintType} options={FormInputOption_ComplaintType} value={inputData.complaintType} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.complaintTypeDetails} value={inputData.complaintTypeDetails} onChange={handleInputBoxChange} />
      <SelectBox {...FormInputFieldObject.healthConcern} options={FormInputOption_YesNo} value={inputData.healthConcern} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.healthConcernDetails} value={inputData.healthConcernDetails} onChange={handleInputBoxChange} />
      <MultiSelectBox {...FormInputFieldObject.issue} options={FormInputOption_Issue} value={inputData.issue} onChange={handleMultiSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.issueDetails} value={inputData.issueDetails} onChange={handleInputBoxChange} />

      <Line />
      <Header text="4. Other" />
      <SelectBox {...FormInputFieldObject.sampleHeld} options={FormInputOption_YesNo} value={inputData.sampleHeld} onChange={handleSelectBoxChangeWrapper} />
      <SelectBox {...FormInputFieldObject.response} options={FormInputOption_Response} value={inputData.response} onChange={handleSelectBoxChangeWrapper} />  
      <SelectBox {...FormInputFieldObject.followUpRequired} options={FormInputOption_YesNo} value={inputData.followUpRequired} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.additionalNotes} value={inputData.additionalNotes} onChange={handleInputBoxChange} />

      <Button className="bg-[var(--pale-green-color)] w-full" onClick={handleSubmit}>
        <span className="text-white text--sub--small font-medium block h-fit w-fit p-1.5">
          Submit
        </span>
      </Button>
    </form>
  )
}

export default FormSection;

const Line = () => {
  return (
    <div className="w-full h-0.5 bg-[var(--black-color)] mt-2" />
  )
}

interface HeaderProps {
  text: string
}
const Header = ({text}: HeaderProps) => {
  return (
    <div className="text-[var(--black-color)] text--sub--header">
      {text}
    </div>
  )
}

const SubHeader = ({text}: HeaderProps) => {
  return (
    <div className="text-[var(--black-color)] text--content">
      {text}
    </div>
  )
}

