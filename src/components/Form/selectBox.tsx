import { cn } from "@/lib/tailwind-merge";
import { FormInputFieldRequired } from "@/types/data";
import { FormInputOption_Type } from "@/types/type";
import chroma from "chroma-js";
import { MultiValue, SingleValue, StylesConfig } from "react-select";
import Select from "react-select";

interface SelectBoxProps {
  label: string;
  name: string;
  options?: FormInputOption_Type[];
  type: string;
  value: string;
  isError: boolean;
  onChange: Function;
  isSearchable?: boolean; // Optional: enable search functionality
}

type Color = chroma.Color;

// Greenhouse-branded select styles with sharp corners
const greenhouseSelectStyles: StylesConfig<FormInputOption_Type> = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "white",
    borderWidth: "2px",
    borderColor: isFocused ? "var(--olive-green)" : "var(--text-light)",
    borderRadius: "0", // Sharp corners
    boxShadow: "none",
    outline: "none",
    minHeight: "48px", // Match input height (h-12)
    height: "48px", // Fixed height
    transition: "all 0.2s ease-in-out",
    ":hover": {
      borderColor: "var(--olive-green)",
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: "0 12px", // Match input px-3 horizontal padding only
    height: "44px", // Total height minus border (48px - 2px top - 2px bottom)
  }),
  input: (styles) => ({
    ...styles,
    margin: "0",
    padding: "0",
  }),
  option: (styles, { isFocused, isSelected }) => {
    const oliveGreen = "#6B7456";
    const color: Color = chroma(oliveGreen);
    return {
      ...styles,
      borderRadius: '0', // Sharp corners
      backgroundColor: isSelected
        ? oliveGreen
        : isFocused
          ? color.alpha(0.1).css()
          : undefined,
      color: isSelected ? 'white' : 'var(--text-primary)',
      cursor: 'pointer',
      fontWeight: isSelected ? '600' : '400',
      ':active': {
        ...styles[':active'],
        backgroundColor: isSelected
          ? oliveGreen
          : color.alpha(0.3).css(),
      },
    };
  },
  menu: (styles) => ({
    ...styles,
    borderRadius: '0', // Sharp corners
    boxShadow: '0 4px 16px rgba(107, 116, 86, 0.15)',
  }),
  menuList: (styles) => ({
    ...styles,
    borderRadius: '0', // Sharp corners
    padding: '4px',
  }),
};

const SelectBox = (props: SelectBoxProps) => {
  const {options, label, name, value, isError, onChange, isSearchable = false} = props;
  const isRequired: boolean = FormInputFieldRequired.includes(name);
  const isErrorCurrent: boolean = isError && isRequired && !value;
  const isSuccess: boolean = isRequired && !!value;
  
  const handleSelectChange = (selectedOption: SingleValue<FormInputOption_Type>) => {
    onChange(name, selectedOption?.value ?? "");
  }
  
  return (
    options && (
      <div className="w-full">
        <label
          className="text-[var(--text-primary)] text-sm font-semibold block mb-2"
        >
          {label}
          {isRequired && (
            <span className="text-sm text-[var(--error-red)] ml-1">
              *
            </span>
          )}
        </label>
        <Select
          instanceId={name}
          inputId={name}
          options={options}
          styles={greenhouseSelectStyles}
          className={cn("text--content")}
          value={options.find((o) => o.value === value) ?? null}
          onChange={(s) => handleSelectChange(s)}
          isMulti={false}
          isClearable={true}
          isSearchable={isSearchable}
          placeholder={isSearchable ? "Search or select..." : "Select..."}
        />
        {/* Error message display */}
        {isErrorCurrent && (
          <p className="text-xs text-[var(--error-red)] mt-1 font-medium">
            This field is required
          </p>
        )}
      </div>
    )
  )
}
export default SelectBox;

interface MultiSelectBoxProps {
  label: string;
  name: string;
  options?: FormInputOption_Type[];
  type: string;
  value: string[];
  isError: boolean;
  onChange: Function;
}

export const MultiSelectBox = (props: MultiSelectBoxProps) => {
  const {options, label, name, value, isError, onChange} = props;
  const isRequired: boolean = FormInputFieldRequired.includes(name);
  const isErrorCurrent: boolean = isError && isRequired && !value.length;
  
  const handleSelectChange = (selectedOptions: MultiValue<FormInputOption_Type>) => {
    const values: string[] = selectedOptions.map((option) => option.value);
    onChange(name, values);
  }
  
  return (
    options && (
      <div className="w-full">
        <label
          className="text-[var(--text-primary)] text-sm font-semibold block mb-2"
        >
          {label}
          {isRequired && (
            <span className="text-sm text-[var(--error-red)] ml-1">
              *
            </span>
          )}
        </label>
        <Select
          instanceId={name}
          inputId={name}
          options={options}
          styles={greenhouseSelectStyles}
          className={cn("text--content")}
          value={options.filter((o) => value.includes(o.value))}
          onChange={(s) => handleSelectChange(s)}
          isMulti={true}
          isClearable={true}
        />
        {/* Error message display */}
        {isErrorCurrent && (
          <p className="text-xs text-[var(--error-red)] mt-1 font-medium">
            This field is required
          </p>
        )}
      </div>
    )
  )
}
