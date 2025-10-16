/**
 * Input Box Component
 * 
 * A reusable form input component with validation styling and required field indicators.
 * Used for text inputs, numbers, dates, and other single-line form fields.
 * 
 * Features:
 * - Automatic required field detection and asterisk display
 * - Error state styling with red borders (Greenhouse error red)
 * - Success state styling with green borders
 * - Consistent label and input styling
 * - Disabled autocomplete, autocorrect, and spellcheck for better UX
 * - Responsive design with proper focus states
 * - Sharp corners matching Greenhouse design language
 * - Smooth transitions on interaction
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
  label: string;
  name: string;
  type: string;
  value: string;
  isError: boolean;
  onChange: Function;
}

const InputBox = (props: Props) => {
  const { label, name, type, value, isError, onChange } = props;
  
  // Check if this field is required based on the global required fields list
  const isRequired: boolean = FormInputFieldRequired.includes(name);
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone validation regex (accepts various formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890)
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  
  // Validate email format
  const isEmailInvalid: boolean = type === 'email' && !!value && !emailRegex.test(value);
  
  // Validate phone format
  const isPhoneInvalid: boolean = type === 'tel' && !!value && !phoneRegex.test(value);
  
  // Show error styling only if: global error state + field is required + field is empty
  const isErrorCurrent: boolean = isError && isRequired && !value;
  
  // Show format error if value exists but format is invalid
  const isFormatError: boolean = isEmailInvalid || isPhoneInvalid;
  
  // Show success styling if field is filled (optional enhancement)
  const isSuccess: boolean = isRequired && !!value && !isFormatError;
  
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
      
      {/* Input field with conditional error/success styling */}
      <input
        id={name}
        name={name}
        type={type}
        className={cn(
          "text-[var(--text-primary)] text--content input--box h-12 px-3 py-2",
          (isErrorCurrent || isFormatError) && "input--box--error",
          !(isErrorCurrent || isFormatError) && isSuccess && "input--box--success"
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
      
      {/* Format validation error messages */}
      {isEmailInvalid && (
        <p className="text-xs text-[var(--error-red)] mt-1 font-medium">
          Please enter a valid email address (e.g., name@example.com)
        </p>
      )}
      
      {isPhoneInvalid && (
        <p className="text-xs text-[var(--error-red)] mt-1 font-medium">
          Please enter a valid phone number (e.g., 123-456-7890 or (123) 456-7890)
        </p>
      )}
    </div>
  )
}

export default InputBox;
