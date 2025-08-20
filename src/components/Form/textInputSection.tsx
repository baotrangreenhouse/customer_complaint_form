import { cn } from "@/lib/tailwind-merge";


interface Props {
  label: string,
  name: string,
  type: string,
  value: string,
  placeholder: string,
  isError: boolean,
  onChange: Function,
  readonly: boolean
}

const TextInputSection = (props : Props) => {
  const {label, name, type, value, placeholder, isError, onChange, readonly} = props;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-black text-sm font-medium block mb-2"
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        className={cn(`text--content text-black input--line p-2`, {
          'border-b-red-600': isError === true,
          'border-b-[#A1A1AA]': isError === false,
        })}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
        readOnly={readonly}
      />
    </div>
  )
}

export default TextInputSection;
