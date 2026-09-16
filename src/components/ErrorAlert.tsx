import React from 'react';
import { AlertCircle, RefreshCw, Globe2 } from 'lucide-react';
import { POPULAR_CITIES } from '../api/weatherApi';

interface ErrorAlertProps {
  errorMessage: string;
  onRetry: () => void;
  onSelectFallbackCity: (city: (typeof POPULAR_CITIES)[0]) => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errorMessage,
  onRetry,
  onSelectFallbackCity,
}) => {
  return (
    <div
      id="weather-error-banner"
      className="w-full bg-red-50/90 border border-red-200 rounded-2xl p-6 text-center max-w-2xl mx-auto my-6 shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-red-950 mb-1">
        Weather Data Fetch Failed
      </h3>
      <p className="text-xs sm:text-sm text-red-700 mb-5 max-w-md mx-auto leading-relaxed">
        {errorMessage || 'Unable to retrieve meteorological measurements at this time.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          id="retry-fetch-btn"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-red-100">
        <span className="text-xs text-red-600 block mb-2 font-medium">
          Or load a known global capital:
        </span>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {POPULAR_CITIES.slice(0, 4).map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => onSelectFallbackCity(city)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-800 hover:bg-red-100/50 transition-colors"
            >
              <Globe2 className="w-3 h-3 text-red-500" />
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
