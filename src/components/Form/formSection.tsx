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
  }
}


type Input = {
  name: string,
  location: string
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
    <form className="flex">
      hello world
      <TextInputSection {...InputAccessories.name} value={input.name} onChange={handleChange} isError={false} />

    </form>
  )
}

export default FormSection;