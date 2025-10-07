/**
 * Success Modal Component
 * 
 * Displays success confirmation after form submission.
 * Matches the error modal design with green success styling.
 * 
 * Features:
 * - Full-screen overlay with backdrop
 * - Success message display
 * - Number of complaints submitted
 * - Auto-dismiss or manual close
 * - Sharp corners matching Greenhouse design
 * - Green accent color for success state
 */

"use client"

import Button from "../Button/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintsCount: number;
}

const SuccessModal = ({ isOpen, onClose, complaintsCount }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md shadow-xl border-4 border-[var(--success-green)]">
        {/* Header */}
        <div className="bg-[var(--success-green)] text-white p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2.5} 
              stroke="currentColor" 
              className="w-16 h-16"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">Success!</h2>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] font-semibold mb-2">
            {complaintsCount === 1 
              ? "Your complaint has been submitted successfully."
              : `${complaintsCount} complaints have been submitted successfully.`
            }
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-4">
            The form has been reset and is ready for a new submission.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 flex justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-8"
          >
            <span className="font-bold">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
