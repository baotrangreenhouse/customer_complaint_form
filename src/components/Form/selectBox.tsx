'use client'
import { FormInputOption_Type } from "@/types/type";
import chroma from "chroma-js";
import { useState } from "react";
import { SingleValue, StylesConfig } from "react-select";
import Select from "react-select";


interface Props {
  label: string,
  name: string,
  options?: FormInputOption_Type[],
  type: string,
  value: string,
  onChange: Function,
}

type Color = chroma.Color;
const colourStyles: StylesConfig<FormInputOption_Type> = {
  control: (styles, { isFocused }) => ({
    ...styles, backgroundColor: 'white', borderWidth: '2px', ':hover': { borderColor: '#1E1E24' }, borderColor: isFocused ? '#1E1E24' : '#A1A1AA', outline: 'none', borderRadius: '0.5rem', boxShadow: ''
  }),
  option: (styles, { isFocused, isSelected }) => {
    const defaultColor = "#37352F";
    const color: Color = chroma(defaultColor);
    return {
      ...styles,
      borderRadius: '0.5rem',
      backgroundColor: isSelected
        ? defaultColor
        : isFocused
          ? color.alpha(0.1).css()
          : undefined,
      color: isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : 'black',
      cursor: 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: isSelected
          ? defaultColor
          : color.alpha(0.3).css(),
      },
    };
  }
};

const SelectBox = (props: Props) => {
  const {options, label, name, onChange} = props;

  const [selectedOption, setSelectedOption] = useState<SingleValue<FormInputOption_Type>>();

  const handleSelectChange = (selectedOption: SingleValue<FormInputOption_Type>) => {
    setSelectedOption(selectedOption);
    onChange(name, selectedOption?.value);
  }

  return (
    options && (
      <div>
        <label
          htmlFor={name}
          className="text-black text-sm font-medium block mb-2"
        >
          {label}
        </label>
        <Select
          instanceId={name}
          options={options}
          styles={colourStyles}
          className="text--content"
          value={selectedOption}
          onChange={(s) => handleSelectChange(s)}
          isMulti={false}
          isClearable={true}
        />
      </div>
    )
  )
}

export default SelectBox;