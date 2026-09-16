import React from 'react';
import { ArrowUp, ArrowDown, Droplets, Wind } from 'lucide-react';
import { DailyForecastDay, TemperatureUnit } from '../types';
import { getWeatherCondition, convertTemp } from '../utils/weatherCodes';

interface DailyForecastGridProps {
  days: DailyForecastDay[];
  unit: TemperatureUnit;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DailyForecastGrid: React.FC<DailyForecastGridProps> = ({
  days,
  unit,
  selectedDate,
  onSelectDate,
}) => {
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div id="seven-day-forecast-section" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">7-Day Forecast</h2>
          <p className="text-xs text-slate-500">Daily high & low projections and expected rainfall</p>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
          Open-Meteo Multi-Day
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const condition = getWeatherCondition(day.weathercode, true);
          const ConditionIcon = condition.icon;
          const maxTemp = convertTemp(day.tempMax, unit);
          const minTemp = convertTemp(day.tempMin, unit);

          return (
            <button
              key={day.date}
              id={`forecast-card-${day.date}`}
              type="button"
              onClick={() => onSelectDate(day.date)}
              className={`p-3.5 rounded-xl text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 border-2 border-sky-500 shadow-sm'
                  : 'bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isSelected ? 'text-sky-900' : 'text-slate-800'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {day.shortDate}
                  </span>
                </div>

                {/* Weather Condition Icon & Label */}
                <div className="my-3 flex flex-col items-center justify-center">
                  <div
                    className={`p-2.5 rounded-xl mb-1.5 ${
                      isSelected ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <ConditionIcon className={`w-7 h-7 ${condition.colorClass}`} />
                  </div>
                  <span className="text-xs text-slate-600 font-medium text-center line-clamp-1">
                    {condition.label}
                  </span>
                </div>
              </div>

              {/* Temperature & Precipitation Stats */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                {/* Max / Min temp */}
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center text-red-600">
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                    {maxTemp}{unitSymbol}
                  </span>
                  <span className="flex items-center text-blue-600">
                    <ArrowDown className="w-3 h-3 mr-0.5" />
                    {minTemp}{unitSymbol}
                  </span>
                </div>

                {/* Precipitation */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    Rain
                  </span>
                  <span
                    className={`font-medium ${
                      day.precipitation > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {day.precipitation.toFixed(1)} mm
                  </span>
                </div>

                {/* Wind */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-slate-400" />
                    Wind
                  </span>
                  <span className="text-slate-600 font-medium">
                    {day.windspeedMax} km/h
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
