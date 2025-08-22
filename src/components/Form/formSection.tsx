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

  const handleClickAddProduct = (index: number) => {
    // new product array
    const newProduct: FormInputProduct_Type[] = [
      ...inputData.product.slice(0, index + 1),
      { ...FormInputDataProductDefault },
      ...inputData.product.slice(index + 1),
    ];
    setInputData({
      ...inputData,
      product: newProduct,
    });
    // new flavour options
    const newFlavourOption: FormInputOption_Type[][] = [
      ...FormInputOption_ProductFlavour.slice(0, index + 1),
      convertToOption(FLAVOUR),
      ...FormInputOption_ProductFlavour.slice(index + 1),
    ];
    setFormInputOption_ProductFlavour(newFlavourOption);
    // new size options
    const newSizeOption: FormInputOption_Type[][] = [
      ...FormInputOption_ProductSize.slice(0, index + 1),
      convertToOption(SIZE),
      ...FormInputOption_ProductSize.slice(index + 1),
    ];
    setFormInputOption_ProductSize(newSizeOption);
  };
  const handleClickRemoveProduct = (index: number) => {
    const newProduct: FormInputProduct_Type[] = inputData.product.filter((_, i) => i !== index);
    setInputData({
      ...inputData,
      product: newProduct,
    });
  }

  return (
    <form className="flex flex-col w-full space-y-3">
      <InputBox {...FormInputFieldObject.customerName} value={inputData.customerName} onChange={handleChange} />
      <SelectBox {...FormInputFieldObject.location} options={FormInputOption_Location} value={inputData.location} onChange={handleSelectChangeWrapper} />
      {inputData.product.map((product: FormInputProduct_Type, index: number) => {
        const handleChange_Product = (event: FormEvent<HTMLFormElement>) => {
          // handle change for bbd, affectedUnit
          var newProduct: FormInputProduct_Type[] = inputData.product;
          if (event.currentTarget.name == "affectedUnit") {
            newProduct[index]["affectedUnit"] = event.currentTarget.value;
          }
          if (event.currentTarget.name == "bestBeforeDate") {
            newProduct[index]["bestBeforeDate"] = event.currentTarget.value;
          }
          setInputData({
            ...inputData,
            product: newProduct
          })
        }
        const handleSelectChangeWrapper_Product = (name: "productFlavour" | "productSize" | "bestBeforeDate", selectedOptionData: string | undefined) => {
          // handle change for productFlavour, productSize
          var newProduct: FormInputProduct_Type[] = inputData.product;
          newProduct[index][name] = selectedOptionData ? selectedOptionData : "";
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
          console.log(product);
        }
        return (
          <div key={index} className="flex flex-col w-full space-y-3">
            <Line />
            <SelectBox {...FormInputFieldObject.productFlavour} options={FormInputOption_ProductFlavour[index]} value={product.productFlavour} onChange={handleSelectChangeWrapper_Product} />
            <SelectBox {...FormInputFieldObject.productSize} options={FormInputOption_ProductSize[index]} value={product.productSize} onChange={handleSelectChangeWrapper_Product} />
            <div className="grid grid-cols-2 gap-2">
              <InputBox {...FormInputFieldObject.affectedUnit} value={product.affectedUnit} onChange={handleChange_Product} />
              <InputBox {...FormInputFieldObject.bestBeforeDate} value={product.bestBeforeDate} onChange={handleChange_Product} />
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
      

    </form>
  )
}

export default FormSection;