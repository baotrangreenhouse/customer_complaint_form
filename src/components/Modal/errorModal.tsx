/**
 * Error Modal Component
 * 
 * Displays detailed error information in a modal overlay.
 * Shows error code, message, and technical details for debugging.
 * 
 * Features:
 * - Full-screen overlay with backdrop
 * - Detailed error information display
 * - Error code, message, and hint
 * - Close button to dismiss
 * - Sharp corners matching Greenhouse design
 * - Red accent color for error state
 */

"use client"

import { XIcon } from "../Icon/icon";
import Button from "../Button/button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    code?: string;
    message: string;
    details?: string;
    hint?: string;
  } | null;
}

const ErrorModal = ({ isOpen, onClose, error }: ErrorModalProps) => {
  if (!isOpen || !error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl shadow-xl border-4 border-[var(--error-red)]">
        {/* Header */}
        <div className="bg-[var(--error-red)] text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Database Submission Error</h2>
              {error.code && (
                <p className="text-sm opacity-90 mt-1">Error Code: {error.code}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-colors"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Error Message
            </h3>
            <p className="text-base text-[var(--text-primary)] bg-gray-100 p-4 font-mono">
              {error.message}
            </p>
          </div>

          {/* Error Details */}
          {error.details && (
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                Technical Details
              </h3>
              <p className="text-sm text-[var(--text-secondary)] bg-gray-100 p-4 font-mono whitespace-pre-wrap">
                {error.details}
              </p>
            </div>
          )}

          {/* Error Hint */}
          {error.hint && (
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
                Suggestion
              </h3>
              <p className="text-sm text-[var(--text-secondary)] bg-blue-50 p-4">
                {error.hint}
              </p>
            </div>
          )}

          {/* Common Solutions */}
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">
              Common Solutions
            </h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
              <li>Check that the Supabase table exists and has correct column names</li>
              <li>Verify all required columns are present in the database</li>
              <li>Ensure column data types match the form data</li>
              <li>Check Supabase RLS (Row Level Security) policies allow inserts</li>
              <li>Verify network connection to Supabase</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6"
          >
            <span className="font-bold">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
