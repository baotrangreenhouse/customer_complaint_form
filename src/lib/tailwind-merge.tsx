/**
 * Tailwind Merge Utility
 * 
 * This utility function combines clsx and tailwind-merge to handle conditional
 * CSS classes and resolve Tailwind class conflicts intelligently.
 * 
 * Functions:
 * - clsx: Conditionally combines class names
 * - twMerge: Resolves Tailwind class conflicts (e.g., "px-2 px-4" becomes "px-4")
 * 
 * Usage:
 * cn("base-class", condition && "conditional-class", "override-class")
 * 
 * Example:
 * cn("p-2", error && "border-red-500", "border-gray-300") 
 * // Results in intelligent merging of conflicting Tailwind classes
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with intelligent Tailwind conflict resolution
 * @param inputs - Array of class names, conditions, and objects
 * @returns Merged and deduplicated class string
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
