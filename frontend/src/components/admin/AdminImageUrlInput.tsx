import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Link as LinkIcon, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ImagePlaceholder } from '../ui/ImagePlaceholder';

interface AdminImageUrlInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  entityName?: string;
  helperText?: string;
  className?: string;
}

export const AdminImageUrlInput: React.FC<AdminImageUrlInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  required = false,
  entityName = 'Preview',
  helperText,
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);

  const trimmedValue = (value || '').trim();
  const isUrlFormatValid =
    !trimmedValue ||
    trimmedValue.startsWith('http://') ||
    trimmedValue.startsWith('https://');
  const isLengthValid = trimmedValue.length <= 512;

  useEffect(() => {
    setLoadError(false);
    setLoadSuccess(false);
  }, [value]);

  const handleClear = () => {
    onChange('');
    setLoadError(false);
    setLoadSuccess(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
          {label} {required && <span className="text-[#DC2626]">*</span>}
        </label>
        {trimmedValue.length > 0 && (
          <span
            className={`text-[10px] font-mono ${
              isLengthValid ? 'text-gray-400' : 'text-red-500 font-bold'
            }`}
          >
            {trimmedValue.length}/512
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview Thumbnail Container */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-gray-200 bg-gray-50 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
          {trimmedValue && !loadError ? (
            <img
              src={trimmedValue}
              alt={entityName}
              className="w-full h-full object-cover"
              onLoad={() => {
                setLoadSuccess(true);
                setLoadError(false);
              }}
              onError={() => {
                setLoadError(true);
                setLoadSuccess(false);
              }}
            />
          ) : (
            <div className="w-full h-full p-1 flex flex-col items-center justify-center text-center">
              <ImagePlaceholder
                label={loadError ? 'Invalid URL' : entityName}
                className="w-full h-full text-[9px] p-1 border-0 bg-transparent"
              />
            </div>
          )}

          {/* Status Indicator Pill */}
          {trimmedValue && loadSuccess && (
            <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs" title="Image loaded successfully">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          )}
          {trimmedValue && loadError && (
            <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-xs" title="Could not load image from this URL">
              <AlertCircle className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* URL Input & Validation feedback */}
        <div className="flex-1 w-full space-y-1.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              required={required}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-9 pr-8 py-2 bg-gray-50 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                !isUrlFormatValid || !isLengthValid
                  ? 'border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                  : 'border-gray-200 focus:ring-[#3FA65C]/20 focus:border-[#3FA65C]'
              }`}
            />
            {trimmedValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear URL"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Validation Warnings & Helper Text */}
          {!isUrlFormatValid && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>URL must start with http:// or https://</span>
            </div>
          )}
          {!isLengthValid && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>URL exceeds maximum allowed length (512 characters).</span>
            </div>
          )}
          {trimmedValue && loadError && isUrlFormatValid && isLengthValid && (
            <p className="text-[11px] text-amber-600">
              Note: Could not preview image at this URL in your browser. Verify the link is publicly accessible.
            </p>
          )}
          {helperText && isUrlFormatValid && isLengthValid && !loadError && (
            <p className="text-[11px] text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};
