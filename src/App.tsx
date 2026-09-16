import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedWeatherData, TemperatureUnit } from './types';
import { fetchWeatherForecast, POPULAR_CITIES } from './api/weatherApi';
import { generateSmartRecommendations } from './utils/planningLogic';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { DailyForecastGrid } from './components/DailyForecastGrid';
import { TemperatureChart } from './components/TemperatureChart';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export default function App() {
  // Default to Tokyo or first popular city
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    admin1?: string;
    country?: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
  }>(POPULAR_CITIES[0]);

  const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const loadWeather = useCallback(
    async (cityToLoad: typeof selectedCity) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherForecast(cityToLoad);
        setWeatherData(data);
        // Default selected date to today
        if (data.daily && data.daily.length > 0) {
          setSelectedDate(data.daily[0].date);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather forecast. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Fetch initial weather on mount and when city changes
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  const handleSelectCity = (newCity: typeof selectedCity) => {
    setSelectedCity(newCity);
  };

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleRetry = () => {
    loadWeather(selectedCity);
  };

  // Generate smart recommendations when weather data is available
  const recommendations = weatherData ? generateSmartRecommendations(weatherData) : [];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Header Navigation */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadWeather(selectedCity)}
        isRefreshing={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Search Section */}
        <section aria-label="City Search">
          <SearchBar
            onSelectCity={handleSelectCity}
            isLoadingWeather={isLoading}
            activeCityName={selectedCity.name}
          />
        </section>

        {/* Error State */}
        {error && !isLoading && (
          <ErrorAlert
            errorMessage={error}
            onRetry={handleRetry}
            onSelectFallbackCity={(city) => {
              setSelectedCity(city);
            }}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Weather Dashboard */}
        {weatherData && (
          <div
            className={`flex flex-col gap-6 transition-opacity duration-200 ${
              isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'
            }`}
          >
            {/* 1. Current Weather Card */}
            <section aria-label="Current Weather">
              <CurrentWeatherCard data={weatherData} unit={unit} />
            </section>

            {/* 2. Smart Planning Recommendations */}
            {recommendations.length > 0 && (
              <section aria-label="Smart Recommendations">
                <SmartRecommendations recommendations={recommendations} />
              </section>
            )}

            {/* 3. 7-Day Forecast Grid */}
            <section aria-label="7-Day Forecast">
              <DailyForecastGrid
                days={weatherData.daily}
                unit={unit}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </section>

            {/* 4. Temperature Trends Chart (Recharts) */}
            <section aria-label="Temperature Trends">
              <TemperatureChart
                days={weatherData.daily}
                unit={unit}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Weather Intelligence • Real-time Meteorological Intelligence</span>
          <span>
            Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline font-medium"
            >
              Open-Meteo Public APIs
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
