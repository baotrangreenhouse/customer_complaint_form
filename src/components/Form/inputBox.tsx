
interface Props {
  label: string,
  name: string,
  type: string,
  value: string,
  onChange: Function,
}

const InputBox = (props : Props) => {
  const {label, name, type, value, onChange} = props;

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
        className="text-[var(--black-color)] text--content input--box p-1.5"
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
