import React from 'react';
import {
  Wind,
  Compass,
  Droplets,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
  Thermometer,
} from 'lucide-react';
import { ProcessedWeatherData, TemperatureUnit } from '../types';
import { getWeatherCondition, formatWindDirection, convertTemp } from '../utils/weatherCodes';

interface CurrentWeatherCardProps {
  data: ProcessedWeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const current = data.current;
  const condition = getWeatherCondition(current.weathercode, current.isDay);
  const ConditionIcon = condition.icon;

  const tempVal = convertTemp(current.temperature, unit);
  const maxTempVal = convertTemp(current.tempMaxToday, unit);
  const minTempVal = convertTemp(current.tempMinToday, unit);
  const feelsLikeVal = current.apparentTemperature !== undefined
    ? convertTemp(current.apparentTemperature, unit)
    : tempVal;

  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  const windDir = formatWindDirection(current.winddirection);

  // Format local observation time
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div
      id="current-weather-card"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
    >
      {/* Top Banner / Location Header */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1.5 font-medium">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              {data.location.region ? `${data.location.region}, ` : ''}
              {data.location.country || data.location.timezone}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {data.location.name}
          </h1>

          <div className="mt-2.5 flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${condition.badgeBg} ${condition.badgeText}`}
            >
              <ConditionIcon className="w-3.5 h-3.5" />
              {condition.label}
            </span>
            <span className="text-xs text-slate-500">{condition.description}</span>
          </div>
        </div>

        {/* Big Temperature Hero Section */}
        <div className="flex items-center gap-5 sm:gap-7 self-start md:self-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <ConditionIcon className={`w-14 h-14 sm:w-16 sm:h-16 ${condition.colorClass}`} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tighter">
                {tempVal}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-400 ml-1">
                {unitSymbol}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
              <span>Feels like {feelsLikeVal}{unitSymbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-100 divide-x divide-slate-100 bg-slate-50/60">
        {/* Wind Speed */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-sky-600 border border-slate-200/70 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
            <div className="text-sm sm:text-base font-bold text-slate-800">
              {current.windspeed} <span className="text-xs font-normal text-slate-500">km/h</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Compass className="w-3 h-3" />
              {windDir} ({current.winddirection}°)
            </div>
          </div>
        </div>

        {/* Day Range High / Low */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-amber-600 border border-slate-200/70 shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Today's Range</div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800">
              <span className="flex items-center text-red-600 text-xs">
                <ArrowUp className="w-3 h-3 mr-0.5" />
                {maxTempVal}{unitSymbol}
              </span>
              <span className="text-slate-300">/</span>
              <span className="flex items-center text-blue-600 text-xs">
                <ArrowDown className="w-3 h-3 mr-0.5" />
                {minTempVal}{unitSymbol}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Daily Extremes</div>
          </div>
        </div>

        {/* Precipitation Today */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-blue-600 border border-slate-200/70 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Precipitation</div>
            <div className="text-sm sm:text-base font-bold text-slate-800">
              {current.precipitationToday} <span className="text-xs font-normal text-slate-500">mm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.precipitationToday > 0 ? 'Rain logged' : 'Dry day'}
            </div>
          </div>
        </div>

        {/* Humidity or Atmospheric Indicator */}
        <div className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-teal-600 border border-slate-200/70 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Humidity</div>
            <div className="text-sm sm:text-base font-bold text-slate-800">
              {current.humidity !== undefined ? `${current.humidity}%` : 'Normal'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.humidity !== undefined
                ? current.humidity > 70
                  ? 'High humidity'
                  : current.humidity < 35
                  ? 'Dry air'
                  : 'Comfortable'
                : 'Ambient relative'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
