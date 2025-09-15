/**
 * Reusable Button Component
 * 
 * A flexible button component that handles both regular clicks and indexed clicks.
 * Used throughout the form for actions like submit, add product, remove product.
 * 
 * Features:
 * - Supports both "submit" and "button" types
 * - Custom styling through className prop
 * - Tailwind utility merging for consistent styling
 * - Optional index parameter for array operations
 * - Hover effects and shadow styling
 * 
 * Props:
 * - children: Button content (text, icons, etc.)
 * - type: "submit" | "button" for form behavior
 * - className: Custom Tailwind classes
 * - onClick: Click handler function
 * - index: Optional index for array operations (add/remove products)
 */
import { cn } from "@/lib/tailwind-merge";
import { ReactNode } from "react";

interface Props {
  children: ReactNode,
  type: "submit" | "button",
  className: string,
  onClick: Function,
  index?: number
}

const Button = ({ children, type, className, onClick, index }: Props) => {
  return (
    <button
      type={type}
      className={cn(
        `h-fit w-fit rounded-lg shadow-inner hover:brightness-125 place-items-center`, 
        className
      )}
      onClick={(e) => {
        // Handle indexed clicks (for add/remove product operations)
        if (index !== undefined) {
          onClick(index);
        } else {
          // Handle regular clicks (for submit, etc.)
          onClick(e);
        }
      }}
    >
      {children}
    </button>
  )
}

export default Button;