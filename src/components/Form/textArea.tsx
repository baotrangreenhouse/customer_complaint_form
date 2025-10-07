/**
 * Text Area Component
 * 
 * A reusable form textarea component for multi-line text inputs.
 * Similar to InputBox but uses textarea element for longer text content.
 * 
 * Features:
 * - Automatic required field detection and asterisk display
 * - Error state styling with red borders (Greenhouse error red)
 * - Success state styling with green borders
 * - Consistent label and textarea styling
 * - Disabled autocomplete, autocorrect, and spellcheck
 * - Resizable textarea for user convenience
 * - Sharp corners matching Greenhouse design language
 * - Smooth transitions on interaction
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
  label: string;
  name: string;
  type: string;
  value: string;
  isError: boolean;
  onChange: Function;
}

const TextArea = (props: Props) => {
  const { label, name, type, value, isError, onChange } = props;
  
  // Check if this field is required based on the global required fields list
  const isRequired: boolean = FormInputFieldRequired.includes(name);
  
  // Show error styling only if: global error state + field is required + field is empty
  const isErrorCurrent: boolean = isError && isRequired && !value;
  
  // Show success styling if field is filled (optional enhancement)
  const isSuccess: boolean = isRequired && !!value;
  
  return (
    <div className="w-full">
      {/* Field label with required indicator */}
      <label
        htmlFor={name}
        className="text-[var(--text-primary)] text-sm font-semibold block mb-2"
      >
        {label}
        {/* Red asterisk for required fields */}
        {isRequired && (
          <span className="text-sm text-[var(--error-red)] ml-1">
            *
          </span>
        )}
      </label>
      
      {/* Textarea field with conditional error/success styling */}
      <textarea
        id={name}
        name={name}
        rows={4}
        className={cn(
          "text--content text-[var(--text-primary)] input--box px-3 py-2 resize-y min-h-[100px]",
          isErrorCurrent && "input--box--error",
          !isErrorCurrent && isSuccess && "input--box--success"
        )}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"    // Disable browser autocomplete
        autoCorrect="off"     // Disable mobile autocorrect  
        spellCheck="false"    // Disable spellcheck for form fields
      />
      
      {/* Error message display */}
      {isErrorCurrent && (
        <p className="text-xs text-[var(--error-red)] mt-1 font-medium">
          This field is required
        </p>
      )}
    </div>
  )
}

export default TextArea;