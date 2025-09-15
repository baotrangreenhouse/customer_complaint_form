/**
 * Text Area Component
 * 
 * A reusable form textarea component for multi-line text inputs.
 * Similar to InputBox but uses textarea element for longer text content.
 * 
 * Features:
 * - Automatic required field detection and asterisk display
 * - Error state styling with red borders
 * - Consistent label and textarea styling
 * - Disabled autocomplete, autocorrect, and spellcheck
 * - Resizable textarea for user convenience
 * 
 * Used for fields like:
 * - Complaint details
 * - Health concern details  
 * - Issue details
 * - Additional notes
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

const TextArea = (props: Props) => {
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
      
      {/* Textarea field with conditional error styling */}
      <textarea
        name={name}
        className={cn(
          "text--content text-[var(--black-color)] input--box p-1.5", 
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

export default TextArea;