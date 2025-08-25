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

const TextArea = (props : Props) => {
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
      <textarea
        name={name}
        className={cn("text--content text-[var(--black-color)] input--box p-1.5", isErrorCurrent ? "border-[var(--red-color)]" : "")}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
}

export default TextArea;