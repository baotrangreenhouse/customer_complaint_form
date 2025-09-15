/**
 * Input Box Component
 * 
 * A reusable form input component with validation styling and required field indicators.
 * Used for text inputs, numbers, dates, and other single-line form fields.
 * 
 * Features:
 * - Automatic required field detection and asterisk display
 * - Error state styling with red borders
 * - Consistent label and input styling
 * - Disabled autocomplete, autocorrect, and spellcheck for better UX
 * - Responsive design with proper focus states
 * 
 * Props:
 * - label: Display text for the input field
 * - name: Field name (used for form submission and validation)
 * - type: HTML input type (text, number, datetime-local, etc.)
 * - value: Current input value
 * - isError: Global error state from parent form
 * - onChange: Function to handle input changes
 */
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

const InputBox = (props: Props) => {
  const { label, name, type, value, isError, onChange } = props;
  
  // Check if this field is required based on the global required fields list
  const isRequired: boolean = FormInputFieldRequired.includes(name);
  
  // Show error styling only if: global error state + field is required + field is empty
  const isErrorCurrent: boolean = isError && isRequired && !value;
  
  return (
    <div>
      {/* Field label with required indicator */}
      <label
        htmlFor={name}
        className="text-[var(--black-color)] text-sm font-medium block mb-2"
      >
        {label}
        {/* Red asterisk for required fields */}
        {isRequired && (
          <span className="text-sm text-[var(--red-color)]">
            *
          </span>
        )}
      </label>
      
      {/* Input field with conditional error styling */}
      <input
        name={name}
        type={type}
        className={cn(
          "text-[var(--black-color)] text--content input--box p-1.5", 
          isErrorCurrent ? "border-[var(--red-color)]" : ""
        )}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"    // Disable browser autocomplete
        autoCorrect="off"     // Disable mobile autocorrect
        spellCheck="false"    // Disable spellcheck for form fields
      />
    </div>
  )
}

export default InputBox;
