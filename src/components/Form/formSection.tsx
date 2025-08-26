"use client"

import { FormEvent, useEffect, useState } from "react";
import { FormInputData_Type, FormInputOption_Type, FormInputProduct_Type } from "@/types/type";
import { FormInputFieldObject, FormInputFieldRequired } from "@/types/data";
import SelectBox, { MultiSelectBox } from "./selectBox";
import { COMPLAINT_TYPE, FLAVOUR, ISSUE, LOCATION, LOCATION_CUSTOMER_SERVICE, PRODUCT, RESPONSE_ACTION, SIZE, YES_NO, convertToOption, filterFlavour, filterSize} from "@/datas/data";
import InputBox from "./inputBox";
import Button from "../Button/button";
import { PlusIcon, TrashIcon } from "../Icon/icon";
import TextArea from "./textArea";
import { submitForm } from "@/app/actions/submitForm";

const FormInputDataProductDefault: FormInputProduct_Type = {
  productFlavour: "", productSize: "", bestBeforeDate: "", affectedUnit: "1"
};
const FormInputDataDefault: FormInputData_Type = {
  customerName: "",
  location: "",
  locationCustomerService: "",
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
const FormInputOption_Location: FormInputOption_Type[] = convertToOption(LOCATION);
const FormInputOption_LocationCustomerService: FormInputOption_Type[] = convertToOption(LOCATION_CUSTOMER_SERVICE);
const FormInputOption_ComplaintType: FormInputOption_Type[] = convertToOption(COMPLAINT_TYPE);
const FormInputOption_YesNo: FormInputOption_Type[] = convertToOption(YES_NO);
const FormInputOption_Issue: FormInputOption_Type[] = convertToOption(ISSUE);
const FormInputOption_Response: FormInputOption_Type[] = convertToOption(RESPONSE_ACTION);

const FormSection = () => {
  const [inputData, setInputData] = useState<FormInputData_Type>(FormInputDataDefault);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [FormInputOption_ProductFlavour, setFormInputOption_ProductFlavour] = useState<FormInputOption_Type[][]>([convertToOption(FLAVOUR)]);
  const [FormInputOption_ProductSize, setFormInputOption_ProductSize] = useState<FormInputOption_Type[][]>([convertToOption(SIZE)]);
  // handleInputBoxChange is for input box
  const handleInputBoxChange = (event: FormEvent<HTMLFormElement>) => {
    setInputData({
      ...inputData,
      [event.currentTarget.name]: event.currentTarget.value
    });
  }
  // handleSelectBoxChangeWrapper is for the select box
  const handleSelectBoxChangeWrapper = (name: string, selectedOptionData: string) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData
    });
  }
  // handleMultiSelectBoxChangeWrapper is for the multi select box
  const handleMultiSelectBoxChangeWrapper = (name: string, selectedOptionData: string[]) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData
    });
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // check for error in the input fields
    const isError: boolean = checkInputData(inputData);
    setIsError(isError);
    if (isError) {
      setErrorMessage("Please fill in the required fields");
      return;
    }
    // post
    const {status, data, error} = await submitForm(inputData);
    if (!error) {
      console.log(status, data);
    }
    if (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    // clear error message when new input is typed in
    // note that error message is only for saying what is an error, it does not responsible for having the input box red
    setErrorMessage("");
  }, [inputData])

  return (
    <form className="flex flex-col w-full space-y-3" onSubmit={(e) => handleSubmit(e)}>
      <Header text="1. Information" />
      <InputBox {...FormInputFieldObject.customerName} value={inputData.customerName} isError={isError} onChange={handleInputBoxChange} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} isError={isError} onChange={handleSelectBoxChangeWrapper} />
      {inputData.location === "Customer Service (Grocery / Non-Greenhouse Retail Store)" && (
        <SelectBox {...FormInputFieldObject.locationCustomerService} options={FormInputOption_LocationCustomerService} value={inputData.locationCustomerService} isError={isError} onChange={handleMultiSelectBoxChangeWrapper} />
      )}
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
          });
        }
        const handleSelectBoxChangeWrapper_Product = (name: "productFlavour" | "productSize", selectedOptionData: string) => {
          // handle change for productFlavour, productSize
          var newProduct: FormInputProduct_Type[] = [...inputData.product];
          newProduct[index][name] = selectedOptionData;
          setInputData({
            ...inputData,
            product: newProduct  
          });
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
            <SelectBox {...FormInputFieldObject.productFlavour} options={FormInputOption_ProductFlavour[index]} value={product.productFlavour} isError={isError} onChange={handleSelectBoxChangeWrapper_Product} />
            <SelectBox {...FormInputFieldObject.productSize} options={FormInputOption_ProductSize[index]} value={product.productSize} isError={isError} onChange={handleSelectBoxChangeWrapper_Product} />
            <div className="grid grid-cols-2 gap-2">
              <InputBox {...FormInputFieldObject.affectedUnit} value={product.affectedUnit} isError={isError} onChange={handleInputBoxChange_Product} />
              <InputBox {...FormInputFieldObject.bestBeforeDate} value={product.bestBeforeDate} isError={isError} onChange={handleInputBoxChange_Product} />
            </div>
            <div className="flex flex-row space-x-2">
              <Button type="button" className="bg-[var(--dark-green-color)]" onClick={handleClickAddProduct} index={index}>
                <span className="text-white block h-fit w-fit p-1.5">
                  <PlusIcon />
                </span>
              </Button>
              <Button type="button" className="bg-[var(--red-color)]" onClick={handleClickRemoveProduct} index={index}>
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
      <SelectBox {...FormInputFieldObject.complaintType} options={FormInputOption_ComplaintType} value={inputData.complaintType} isError={isError} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.complaintTypeDetails} value={inputData.complaintTypeDetails} isError={isError} onChange={handleInputBoxChange} />
      <SelectBox {...FormInputFieldObject.healthConcern} options={FormInputOption_YesNo} value={inputData.healthConcern} isError={isError} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.healthConcernDetails} value={inputData.healthConcernDetails} isError={isError} onChange={handleInputBoxChange} />
      <MultiSelectBox {...FormInputFieldObject.issue} options={FormInputOption_Issue} value={inputData.issue} isError={isError} onChange={handleMultiSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.issueDetails} value={inputData.issueDetails} isError={isError} onChange={handleInputBoxChange} />

      <Line />
      <Header text="4. Other" />
      <SelectBox {...FormInputFieldObject.sampleHeld} options={FormInputOption_YesNo} value={inputData.sampleHeld} isError={isError} onChange={handleSelectBoxChangeWrapper} />
      <SelectBox {...FormInputFieldObject.response} options={FormInputOption_Response} value={inputData.response} isError={isError} onChange={handleSelectBoxChangeWrapper} />  
      <SelectBox {...FormInputFieldObject.followUpRequired} options={FormInputOption_YesNo} value={inputData.followUpRequired} isError={isError} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.additionalNotes} value={inputData.additionalNotes} isError={isError} onChange={handleInputBoxChange} />
      
      <div className="flex flex-col space-y-1">
        <Button type="submit" className="bg-[var(--pale-green-color)] w-full" onClick={handleSubmit}>
          <span className="text-white text--sub--small font-medium block h-fit w-fit p-1.5">
            Submit
          </span>
        </Button>
        {errorMessage && (
          <div className="text-sm text-[var(--red-color)]">
            {errorMessage}
          </div>
        )}
      </div>
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

const checkInputData = (inputData: FormInputData_Type) : boolean => {
  var isError: boolean = false;
  type Keys = keyof FormInputData_Type;
  for (const field of FormInputFieldRequired) {
    if (field === "productFlavour" || field == "productSize" || field == "affectedUnit" || field === "bestBeforeDate") {
      // check each product
      inputData.product.forEach((product: FormInputProduct_Type) => {
        isError = isError || product.productFlavour === "" || product.productSize === "" || product.affectedUnit === "" || product.bestBeforeDate === "";
      })
    } else if (field === "locationCustomerService" && inputData.location !== "Customer Service (Grocery / Non-Greenhouse Retail Store)") {
      // skip locationCustomerService when location is not Customer Service (Grocery / Non-Greenhouse Retail Store)
    } else if (field === "issue") {
      // check issue 
      isError = isError || inputData.issue.length === 0; 
    } else {
      // check the other fields
      const currentField: Keys = field as any;
      const value: string = inputData[currentField] as any;
      isError = isError || value.trim() === "";
    }
    if (isError) {
      // early return
      return isError;
    }
  }
  return isError;
}
