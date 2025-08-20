import { OptionType } from "@/types/type";
import chroma from "chroma-js";
import { SingleValue, StylesConfig } from "react-select";
import Select from "react-select";



interface Props {
  name: string,
  options?: OptionType[],
  type: string,
  value: SingleValue<OptionType>,
  placeholder: string,
  isError: boolean,
  onChange: (selectedOption: SingleValue<OptionType>) => void,
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
const colourStyles: StylesConfig<OptionType> = {
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

const SelectBox: React.FC<Props> = ({ name, options, type, placeholder, value, isError, onChange }) => {
  return (
    options && (
      <Select
        instanceId={name}
        options={options}
        styles={colourStyles}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)} isMulti={false} />)
  )
}

export default SelectBox;