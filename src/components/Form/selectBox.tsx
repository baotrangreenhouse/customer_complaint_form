import { FormInputOption_Type } from "@/types/type";
import chroma from "chroma-js";
import { MultiValue, SingleValue, StylesConfig } from "react-select";
import Select from "react-select";


interface SelectBoxProps {
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
    ...styles, backgroundColor: "white", borderWidth: "2px", ":hover": { borderColor: "#54b3d6" }, borderColor: isFocused ? "#54b3d6" : "#A1A1AA", outline: "none", borderRadius: "0.5rem", boxShadow: ""
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

const SelectBox = (props: SelectBoxProps) => {
  const {options, label, name, value, onChange} = props;
  const handleSelectChange = (selectedOption: SingleValue<FormInputOption_Type>) => {
    onChange(name, selectedOption?.value ?? "");
  }
  return (
    options && (
      <div>
        <label
          htmlFor={name}
          className="text-[var(--black-color)] text-sm font-medium block mb-2"
        >
          {label}
        </label>
        <Select
          instanceId={name}
          options={options}
          styles={colourStyles}
          className="text--content"
          value={options.find((o) => o.value === value) ?? null}
          onChange={(s) => handleSelectChange(s)}
          isMulti={false}
          isClearable={true}
        />
      </div>
    )
  )
}
export default SelectBox;

interface MultiSelectBoxProps {
  label: string,
  name: string,
  options?: FormInputOption_Type[],
  type: string,
  value: string[],
  onChange: Function,
}

const MultiSelectBox = (props: MultiSelectBoxProps) => {
  const {options, label, name, value, onChange} = props;
  const handleSelectChange = (selectedOptions: MultiValue<FormInputOption_Type>) => {
    const values: string[] = selectedOptions.map((option) => option.value);
    console.log(values);
    onChange(name, values);
  }
  return (
    options && (
      <div>
        <label
          htmlFor={name}
          className="text-[var(--black-color)] text-sm font-medium block mb-2"
        >
          {label}
        </label>
        <Select
          instanceId={name}
          options={options}
          styles={colourStyles}
          className="text--content"
          value={options.filter((o) => value?.includes(o.value))}
          onChange={(s) => handleSelectChange(s)}
          isMulti={true}
          isClearable={true}
        />
      </div>
    )
  )
}
export {MultiSelectBox};