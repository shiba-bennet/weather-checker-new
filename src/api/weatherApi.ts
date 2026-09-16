import { GeocodingResult, ForecastApiResponse, ProcessedWeatherData, DailyForecastDay } from '../types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return [];
    }
    throw new Error(err.message || 'Failed to search cities. Please check your network connection.');
  }
}

export async function fetchWeatherForecast(location: {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}): Promise<ProcessedWeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current_weather: 'true',
    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',
    hourly: 'relative_humidity_2m,apparent_temperature',
    timezone: 'auto',
  });

  const url = `${FORECAST_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned HTTP ${response.status} (${response.statusText || 'Error'})`);
    }

    const data: ForecastApiResponse = await response.json();

    if (!data.current_weather || !data.daily || !data.daily.time) {
      throw new Error('Weather data is currently unavailable for this location.');
    }

    // Process daily forecast items
    const days: DailyForecastDay[] = data.daily.time.map((timeStr, index) => {
      const dateObj = new Date(timeStr + 'T00:00:00');
      const isToday = index === 0;

      const dayName = isToday
        ? 'Today'
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      const shortDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: timeStr,
        dayName,
        shortDate,
        weathercode: data.daily.weathercode[index] ?? 0,
        tempMax: Math.round(data.daily.temperature_2m_max[index] * 10) / 10,
        tempMin: Math.round(data.daily.temperature_2m_min[index] * 10) / 10,
        precipitation: Math.round((data.daily.precipitation_sum[index] ?? 0) * 10) / 10,
        windspeedMax: Math.round((data.daily.windspeed_10m_max[index] ?? 0) * 10) / 10,
      };
    });

    // Approximate current humidity and apparent temp if hourly data is present
    let currentHumidity: number | undefined;
    let currentApparent: number | undefined;

    if (data.hourly && data.hourly.time && data.hourly.time.length > 0) {
      const currentIsoHour = data.current_weather.time.slice(0, 13);
      const matchIndex = data.hourly.time.findIndex((t) => t.startsWith(currentIsoHour));
      const idx = matchIndex !== -1 ? matchIndex : 0;

      if (data.hourly.relative_humidity_2m && data.hourly.relative_humidity_2m[idx] !== undefined) {
        currentHumidity = Math.round(data.hourly.relative_humidity_2m[idx]);
      }
      if (data.hourly.apparent_temperature && data.hourly.apparent_temperature[idx] !== undefined) {
        currentApparent = Math.round(data.hourly.apparent_temperature[idx] * 10) / 10;
      }
    }

    const todayForecast = days[0];

    return {
      location: {
        name: location.name,
        region: location.admin1,
        country: location.country,
        countryCode: location.countryCode,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      },
      current: {
        temperature: Math.round(data.current_weather.temperature * 10) / 10,
        windspeed: Math.round(data.current_weather.windspeed * 10) / 10,
        winddirection: data.current_weather.winddirection,
        weathercode: data.current_weather.weathercode,
        isDay: data.current_weather.is_day === 1,
        time: data.current_weather.time,
        apparentTemperature: currentApparent,
        humidity: currentHumidity,
        tempMaxToday: todayForecast ? todayForecast.tempMax : Math.round(data.current_weather.temperature),
        tempMinToday: todayForecast ? todayForecast.tempMin : Math.round(data.current_weather.temperature),
        precipitationToday: todayForecast ? todayForecast.precipitation : 0,
      },
      daily: days.slice(0, 7),
    };
  } catch (error: any) {
    throw new Error(
      error.message || 'Unable to connect to Open-Meteo weather servers. Please check your connection and try again.'
    );
  }
}

// Preset popular cities for instant one-click switching
export const POPULAR_CITIES: Array<{
  name: string;
  admin1?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}> = [
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5085, longitude: -0.1257 },
  { name: 'New York', admin1: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.006 },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', admin1: 'New South Wales', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198 },
];
