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
    <>
      <label
        htmlFor={name}
        className="text-black text-sm font-medium block mb-2"
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        className={cn(`text--content text-black input--box p-2`, {
          'border-red-600': isError === true,
        })}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
        readOnly={readonly}
      />
    </>
  )
}

export default TextInputSection;
