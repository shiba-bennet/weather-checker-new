export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastRaw {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: CurrentWeather;
  daily: DailyForecastRaw;
  hourly?: {
    time: string[];
    relative_humidity_2m?: number[];
    apparent_temperature?: number[];
  };
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  shortDate: string;
  weathercode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windspeedMax: number;
}

export interface ProcessedWeatherData {
  location: {
    name: string;
    region?: string;
    country?: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    isDay: boolean;
    time: string;
    apparentTemperature?: number;
    humidity?: number;
    tempMaxToday: number;
    tempMinToday: number;
    precipitationToday: number;
  };
  daily: DailyForecastDay[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface SmartRecommendation {
  id: string;
  category: 'umbrella' | 'wind' | 'clothing' | 'outdoor' | 'sun';
  title: string;
  description: string;
  status: 'safe' | 'caution' | 'warning' | 'info';
  icon: string;
  metric?: string;
}
