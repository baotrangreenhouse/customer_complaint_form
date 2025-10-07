/**
 * Reusable Button Component
 * 
 * A flexible button component that handles both regular clicks and indexed clicks.
 * Used throughout the form for actions like submit, add product, remove product.
 * 
 * Features:
 * - Supports both "submit" and "button" types
 * - Multiple style variants (primary, secondary, outline, danger)
 * - Custom styling through className prop and variant prop
 * - Tailwind utility merging for consistent styling
 * - Optional index parameter for array operations
 * - Sharp corners matching Greenhouse design language
 * - Smooth hover effects and transitions
 * 
 * Props:
 * - children: Button content (text, icons, etc.)
 * - type: "submit" | "button" for form behavior
 * - className: Custom Tailwind classes (optional)
 * - onClick: Click handler function
 * - index: Optional index for array operations (add/remove products)
 * - variant: Button style variant - "primary" | "secondary" | "outline" | "danger"
 */
import { cn } from "@/lib/tailwind-merge";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  type: "submit" | "button";
  className?: string;
  onClick?: Function;
  index?: number;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

const Button = ({ 
  children, 
  type, 
  className = "", 
  onClick, 
  index,
  variant = "primary" 
}: Props) => {
  
  // Get variant-specific classes
  const variantClasses = {
    primary: "btn--primary",
    secondary: "btn--secondary",
    outline: "btn--outline",
    danger: "btn--danger"
  };
  
  return (
    <button
      type={type}
      className={cn(
        "h-fit w-fit px-4 py-2 place-items-center",
        variantClasses[variant],
        className
      )}
      onClick={(e) => {
        // Only call onClick if it's provided
        if (onClick) {
          // Handle indexed clicks (for add/remove product operations)
          if (index !== undefined) {
            onClick(index);
          } else {
            // Handle regular clicks (for submit, etc.)
            onClick(e);
          }
        }
      }}
    >
      {children}
    </button>
  )
}

export default Button;