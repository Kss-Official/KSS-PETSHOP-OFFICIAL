import React from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  description,
  onRetry,
  isNetworkError,
  className = '',
}) => {
  const displayTitle =
    title || (isNetworkError ? 'Connection Issue' : 'Unable to Load Content');
  const displayMessage =
    description ||
    message ||
    (isNetworkError
      ? 'Unable to reach the server. Please verify your internet connection or server availability.'
      : 'Something unexpected occurred while processing your request. Please try again.');

  return (
    <div
      className={`bg-[#FFF5F5] rounded-3xl p-8 sm:p-10 text-center border border-[#FED7D7] flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-white border border-[#FEB2B2] flex items-center justify-center text-[#E53E3E] shadow-xs">
        {isNetworkError ? (
          <WifiOff className="w-7 h-7" />
        ) : (
          <AlertCircle className="w-7 h-7" />
        )}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-[#9B2C2C]">{displayTitle}</h3>
        <p className="text-xs sm:text-sm text-[#742A2A] font-medium leading-relaxed max-w-md">
          {displayMessage}
        </p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onRetry}
            className="flex items-center gap-2 border-[#FEB2B2] text-[#9B2C2C] hover:bg-[#FED7D7]/40 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
