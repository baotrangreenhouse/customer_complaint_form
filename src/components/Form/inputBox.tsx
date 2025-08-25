import { cn } from "@/lib/tailwind-merge";
import { FormInputFieldRequired } from "@/types/data";

interface Props {
  label: string,
  name: string,
  type: string,
  value: string,
  isError: boolean,
  onChange: Function,
}

const InputBox = (props : Props) => {
  const {label, name, type, value, isError, onChange} = props;
  const isErrorCurrent: boolean = isError && FormInputFieldRequired.includes(name) && !value;
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[var(--black-color)] text-sm font-medium block mb-2"
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        className={cn("text-[var(--black-color)] text--content input--box p-1.5", isErrorCurrent ? "border-[var(--red-color)]" : "")}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}

export default InputBox;
