import React from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-sm shadow-sky-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Weather Intelligence
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Precise forecasts & smart planning advice
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh weather data"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* Unit Toggle: °C / °F */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70">
            <button
              type="button"
              id="unit-toggle-celsius"
              onClick={() => {
                if (unit !== 'celsius') onToggleUnit();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'celsius'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              id="unit-toggle-fahrenheit"
              onClick={() => {
                if (unit !== 'fahrenheit') onToggleUnit();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
