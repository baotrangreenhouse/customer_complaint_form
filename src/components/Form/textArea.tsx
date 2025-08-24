

interface Props {
  label: string,
  name: string,
  type: string,
  value: string,
  onChange: Function,
}

const TextArea = (props : Props) => {
  const {label, name, type, value, onChange} = props;

  return (
    <div>
      <label
        htmlFor={name}
        className="text-black text-sm font-medium block mb-2"
      >
        {label}
      </label>
      <textarea
        name={name}
        className="text--content text-black input--box p-1.5"
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