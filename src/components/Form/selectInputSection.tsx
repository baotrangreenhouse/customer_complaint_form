'use client'
import { FormInputOptionType } from "@/types/type";
import chroma from "chroma-js";
import { useState } from "react";
import { SingleValue, StylesConfig } from "react-select";
import Select from "react-select";


interface Props {
  name: string,
  options?: FormInputOptionType[],
  type: string,
  value: string,
  placeholder: string,
  isError: boolean,
  onChange: Function,
}

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: '10px',
    content: '" "',
    display: 'block',
    marginRight: '8px',
    height: '11px',
    width: '11px',
  },
});

type Color = chroma.Color;
const colourStyles: StylesConfig<FormInputOptionType> = {
  control: (styles, { isFocused }) => ({
    ...styles, backgroundColor: 'white', borderWidth: '2px', ':hover': { borderColor: '#1E1E24' }, borderColor: isFocused ? '#1E1E24' : '#A1A1AA', outline: 'none', borderRadius: '0.5rem', boxShadow: '',
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color: Color = chroma(data.color);
    return {
      ...styles,
      borderRadius: '0.5rem',
      backgroundColor: isSelected
        ? data.color
        : isFocused
          ? color.alpha(0.1).css()
          : undefined,
      color: isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: isSelected
          ? data.color
          : color.alpha(0.3).css(),
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot(), }),
  placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

const SelectBox = (props: Props) => {
  const {options, name, value, placeholder, onChange} = props;

  const [selectedOption, setSelectedOption] = useState<SingleValue<FormInputOptionType>>();

  const handleSelectChange = (selectedOption: SingleValue<FormInputOptionType>) => {
    setSelectedOption(selectedOption);
    onChange(name, selectedOption?.value);
  }

  return (
    options && (
      <Select
        instanceId={name}
        options={options}
        styles={colourStyles}
        placeholder={placeholder}
        value={selectedOption}
        onChange={(s) => handleSelectChange(s)} isMulti={false} />)
  )
}

export default SelectBox;