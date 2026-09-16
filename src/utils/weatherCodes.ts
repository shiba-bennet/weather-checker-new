import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
  Moon,
  CloudMoon,
} from 'lucide-react';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  nightIcon?: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
}

export function getWeatherCondition(code: number, isDay = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: isDay ? 'Sunny and clear conditions' : 'Clear skies tonight',
        icon: isDay ? Sun : Moon,
        colorClass: isDay ? 'text-amber-500' : 'text-indigo-400',
        bgGradient: isDay
          ? 'from-amber-50 to-orange-50/50 border-amber-200/60'
          : 'from-slate-900 to-indigo-950/70 border-indigo-800/40',
        badgeBg: isDay ? 'bg-amber-100' : 'bg-indigo-900/50',
        badgeText: isDay ? 'text-amber-800' : 'text-indigo-200',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: isDay ? 'Bright with scarce cloud cover' : 'Mainly clear night',
        icon: isDay ? CloudSun : CloudMoon,
        colorClass: isDay ? 'text-amber-500' : 'text-indigo-300',
        bgGradient: isDay
          ? 'from-amber-50/70 to-sky-50/50 border-amber-100'
          : 'from-slate-900 to-slate-800 border-slate-700/60',
        badgeBg: isDay ? 'bg-amber-100' : 'bg-slate-800',
        badgeText: isDay ? 'text-amber-800' : 'text-slate-200',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds and pleasant intervals',
        icon: isDay ? CloudSun : CloudMoon,
        colorClass: 'text-sky-500',
        bgGradient: 'from-sky-50 to-slate-50 border-sky-200/60',
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-800',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Persistent cloud cover across the area',
        icon: Cloud,
        colorClass: 'text-slate-500',
        bgGradient: 'from-slate-100 to-gray-100 border-slate-200',
        badgeBg: 'bg-slate-200',
        badgeText: 'text-slate-800',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy / Mist',
        description: 'Reduced visibility due to fog or mist',
        icon: CloudFog,
        colorClass: 'text-teal-500',
        bgGradient: 'from-teal-50 to-slate-50 border-teal-200/60',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light continuous mist-like rain',
        icon: CloudDrizzle,
        colorClass: 'text-cyan-500',
        bgGradient: 'from-cyan-50 to-sky-50 border-cyan-200/60',
        badgeBg: 'bg-cyan-100',
        badgeText: 'text-cyan-800',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Cold drizzle creating icy surfaces',
        icon: CloudDrizzle,
        colorClass: 'text-blue-500',
        bgGradient: 'from-blue-50 to-cyan-50 border-blue-200',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Intermittent light rain showers',
        icon: CloudRain,
        colorClass: 'text-blue-500',
        bgGradient: 'from-blue-50 to-sky-50 border-blue-200/60',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rainfall across the region',
        icon: CloudRain,
        colorClass: 'text-blue-600',
        bgGradient: 'from-blue-100/60 to-indigo-50 border-blue-300/60',
        badgeBg: 'bg-blue-200',
        badgeText: 'text-blue-900',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy precipitation and wet conditions',
        icon: CloudRain,
        colorClass: 'text-indigo-600',
        bgGradient: 'from-indigo-100/70 to-blue-100/70 border-indigo-300',
        badgeBg: 'bg-indigo-200',
        badgeText: 'text-indigo-950',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Sub-freezing rain leading to icy roads',
        icon: CloudRain,
        colorClass: 'text-cyan-600',
        bgGradient: 'from-cyan-100/70 to-blue-100 border-cyan-300',
        badgeBg: 'bg-cyan-200',
        badgeText: 'text-cyan-900',
      };
    case 71:
    case 73:
      return {
        label: 'Snowfall',
        description: 'Light to moderate snow accumulation',
        icon: CloudSnow,
        colorClass: 'text-violet-500',
        bgGradient: 'from-violet-50 to-slate-100 border-violet-200',
        badgeBg: 'bg-violet-100',
        badgeText: 'text-violet-800',
      };
    case 75:
    case 77:
      return {
        label: 'Heavy Snow',
        description: 'Significant snowfall and freezing temperatures',
        icon: Snowflake,
        colorClass: 'text-violet-600',
        bgGradient: 'from-violet-100/70 to-blue-50 border-violet-300',
        badgeBg: 'bg-violet-200',
        badgeText: 'text-violet-900',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Passing rain showers with gusty spells',
        icon: CloudRain,
        colorClass: 'text-blue-500',
        bgGradient: 'from-blue-50 to-sky-100/50 border-blue-200',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-800',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Occasional bursts of snowfall',
        icon: CloudSnow,
        colorClass: 'text-violet-500',
        bgGradient: 'from-violet-50 to-slate-100 border-violet-200',
        badgeBg: 'bg-violet-100',
        badgeText: 'text-violet-800',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Lightning, thunder, and gusty winds',
        icon: CloudLightning,
        colorClass: 'text-amber-600',
        bgGradient: 'from-amber-100/80 to-purple-100/50 border-amber-300',
        badgeBg: 'bg-amber-200',
        badgeText: 'text-amber-900',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        description: 'Severe storm with hail and damaging winds',
        icon: CloudLightning,
        colorClass: 'text-red-600',
        bgGradient: 'from-red-100/70 to-amber-100/60 border-red-300',
        badgeBg: 'bg-red-200',
        badgeText: 'text-red-900',
      };
    default:
      return {
        label: 'Variable Weather',
        description: 'Moderate conditions with shifting skies',
        icon: Wind,
        colorClass: 'text-slate-500',
        bgGradient: 'from-slate-50 to-gray-50 border-slate-200',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-700',
      };
  }
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius * 10) / 10;
}
