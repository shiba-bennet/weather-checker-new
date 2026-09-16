import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Navigation, Globe2 } from 'lucide-react';
import { GeocodingResult } from '../types';
import { searchCities, POPULAR_CITIES } from '../api/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: {
    name: string;
    admin1?: string;
    country?: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
  }) => void;
  isLoadingWeather: boolean;
  activeCityName: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  isLoadingWeather,
  activeCityName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const abortController = new AbortController();
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query, abortController.signal);
        setResults(data);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setSearchError('Could not fetch suggestions. Check network connection.');
        }
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: {
    name: string;
    admin1?: string;
    country?: string;
    countryCode?: string;
    latitude: number;
    longitude: number;
  }) => {
    onSelectCity(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        handleSelect(results[highlightedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onSelectCity({
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not acquire your GPS coordinates.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can search any city by name instead.';
        }
        alert(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div id="search-section" className="w-full flex flex-col gap-3">
      <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
        <div className="relative flex items-center shadow-sm rounded-xl bg-white border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all duration-200">
          <div className="pl-4 pr-2 text-slate-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            id="city-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any global city (e.g., Tokyo, Madrid, Vancouver)..."
            className="w-full py-3.5 pr-20 text-slate-800 placeholder-slate-400 text-base font-normal bg-transparent outline-none focus:outline-none"
            autoComplete="off"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                id="clear-search-btn"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="geo-location-btn"
              onClick={handleGetCurrentLocation}
              disabled={isLocating || isLoadingWeather}
              title="Use current device location"
              className="p-2 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div
            id="autocomplete-dropdown"
            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1.5 max-h-80 overflow-y-auto"
          >
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isSelected = idx === highlightedIndex;
                const locationDetail = [item.admin1, item.country].filter(Boolean).join(', ');

                return (
                  <button
                    key={item.id}
                    id={`search-result-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                      isSelected ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-sky-600' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                        {locationDetail && (
                          <span className="text-xs text-slate-500 ml-2">{locationDetail}</span>
                        )}
                      </div>
                    </div>

                    {item.country_code && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 tracking-wider">
                        {item.country_code}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              !isSearching &&
              query.trim().length >= 2 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  <Globe2 className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                  No matching cities found for &ldquo;{query}&rdquo;
                </div>
              )
            )}

            {searchError && (
              <div className="px-4 py-2 text-xs text-amber-600 bg-amber-50">
                {searchError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset quick city chips */}
      <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1">
        <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">
          Quick View:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive = activeCityName.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              id={`preset-city-${city.name.toLowerCase()}`}
              onClick={() => onSelectCity(city)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
