"use client"

import { FormEvent, useState } from "react";
import { FormInputData_Type, FormInputOption_Type, FormInputProduct_Type } from "@/types/type";
import { FormInputFieldObject } from "@/types/data";
import SelectBox from "./selectBox";
import { FLAVOUR, LOCATION, SIZE, convertToOption, filterFlavour, filterSize} from "@/datas/data";
import InputBox from "./inputBox";
import Button from "../Button/button";
import { PlusIcon, TrashIcon } from "../Icon/icon";
import Line from "./line";

const FormInputDataProductDefault: FormInputProduct_Type = {
  productFlavour: "", productSize: "", bestBeforeDate: "", affectedUnit: "1"
}

const FormInputDataDefault: FormInputData_Type = {
  customerName: "",
  location: "",
  product: [FormInputDataProductDefault],
  complaintType: "",
  complaintTypeDetails: "",
  healthConcern: "",
  healthConcernDetails: "",
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

  const [FormInputOption_ProductFlavour, setFormInputOption_ProductFlavour] = useState<FormInputOption_Type[][]>([convertToOption(FLAVOUR)]);
  const [FormInputOption_ProductSize, setFormInputOption_ProductSize] = useState<FormInputOption_Type[][]>([convertToOption(SIZE)]);

  const handleInputBoxChange = (event: FormEvent<HTMLFormElement>) => {
    setInputData({
      ...inputData,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  const handleSelectBoxChangeWrapper = (name: string, selectedOptionData: string | undefined) => {
    setInputData({
      ...inputData,
      [name]: selectedOptionData ? selectedOptionData : ""
    })
  }
  const handleClickAddProduct = (index: number) => {
    // add to product
    const newProduct: FormInputProduct_Type[] = [
      ...inputData.product.slice(0, index + 1),
      { ...FormInputDataProductDefault },
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
    console.log(FormInputDataProductDefault);
    console.log(inputData);
    console.log(FormInputOption_ProductFlavour);
    console.log(FormInputOption_ProductSize);
  }
  const handleClickRemoveProduct = (index: number) => {
    const newProduct: FormInputProduct_Type[] = inputData.product.filter((_, i) => i !== index);
    setInputData({
      ...inputData,
      product: newProduct,
    });
  }

  return (
    <form className="flex flex-col w-full space-y-3">
      <InputBox {...FormInputFieldObject.customerName} value={inputData.customerName} onChange={handleInputBoxChange} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} onChange={handleSelectBoxChangeWrapper} />
      {inputData.product.map((product: FormInputProduct_Type, index: number) => {
        const handleInputBoxChange_Product = (event: FormEvent<HTMLFormElement>) => {
          // handle change for bestBeforeDate, affectedUnit
          var newProduct: FormInputProduct_Type[] = [...inputData.product];
          // if (event.currentTarget.name == "affectedUnit") {
          //   newProduct[index]["affectedUnit"] = event.currentTarget.value;
          // }
          // if (event.currentTarget.name == "bestBeforeDate") {
          //   newProduct[index]["bestBeforeDate"] = event.currentTarget.value;
          // }
          const name: "bestBeforeDate" | "affectedUnit" = event.currentTarget.name as any;
          const value: string = event.currentTarget.value;
          newProduct[index][name] = value;
          setInputData({
            ...inputData,
            product: newProduct
          })
        }
        const handleSelectBoxChangeWrapper_Product = (name: "productFlavour" | "productSize" | "bestBeforeDate", selectedOptionData: string | undefined) => {
          // handle change for productFlavour, productSize
          var newProduct: FormInputProduct_Type[] = [...inputData.product];
          newProduct[index][name] = selectedOptionData ?? "";
          setInputData({
            ...inputData,
            product: newProduct  
          })
          // handle option
          // flavour
          var newFlavourOption: FormInputOption_Type[][] = FormInputOption_ProductFlavour;
          newFlavourOption[index] = convertToOption(FLAVOUR.filter((flavour: string) => filterFlavour(flavour, product.productSize)));
          setFormInputOption_ProductFlavour(newFlavourOption);
          // size
          var newSizeOption: FormInputOption_Type[][] = FormInputOption_ProductSize;
          newSizeOption[index] = convertToOption(SIZE.filter((size: string) => filterSize(product.productFlavour, size)))
          setFormInputOption_ProductSize(newSizeOption);
          console.log(inputData, selectedOptionData);
        }
        return (
          <div key={index} className="flex flex-col w-full space-y-3">
            <Line />
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

      {/* <SelectBox {...FormInputFieldObject.complaintType} options={} value={inputData.complaintType} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.complaintTypeDetails} value={inputData.complaintTypeDetails} onChange={handleInputBoxChange} />

      <SelectBox {...FormInputFieldObject.healthConcern} options={} value={inputData.healthConcern} onChange={handleSelectBoxChangeWrapper} />
      <TextArea {...FormInputFieldObject.healthConcern} value={inputData.healthConcernDetails} onChange={handleInputBoxChange} />

      <SelectBox {...FormInputFieldObject.issue} options={}  */}
    </form>
  )
}

export default FormSection;