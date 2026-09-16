import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DailyForecastDay, TemperatureUnit } from '../types';
import { convertTemp, getWeatherCondition } from '../utils/weatherCodes';
import { TrendingUp, BarChart3, Info } from 'lucide-react';

interface TemperatureChartProps {
  days: DailyForecastDay[];
  unit: TemperatureUnit;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  days,
  unit,
  selectedDate,
  onSelectDate,
}) => {
  const [showPrecipitationBar, setShowPrecipitationBar] = useState(true);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  // Transform data for recharts
  const chartData = days.map((day) => {
    const condition = getWeatherCondition(day.weathercode, true);
    return {
      date: day.date,
      dayLabel: day.dayName,
      fullDate: `${day.dayName}, ${day.shortDate}`,
      tempMax: convertTemp(day.tempMax, unit),
      tempMin: convertTemp(day.tempMin, unit),
      precipitation: day.precipitation,
      conditionLabel: condition.label,
      weathercode: day.weathercode,
      isSelected: day.date === selectedDate,
    };
  });

  // Calculate min & max limits for temperature y-axis
  const allTemps = chartData.flatMap((d) => [d.tempMax, d.tempMin]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const yMin = Math.floor(minTemp - 3);
  const yMax = Math.ceil(maxTemp + 3);

  // Custom sleek tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const condition = getWeatherCondition(data.weathercode, true);
      const ConditionIcon = condition.icon;

      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl border border-slate-700 min-w-[170px]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-100">{data.fullDate}</span>
            <ConditionIcon className={`w-4 h-4 ${condition.colorClass}`} />
          </div>

          <div className="text-slate-300 font-medium mb-1 text-[11px]">
            {data.conditionLabel}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-red-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Max Temp:
              </span>
              <span className="font-bold text-slate-100">{data.tempMax}{unitSymbol}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                Min Temp:
              </span>
              <span className="font-bold text-slate-100">{data.tempMin}{unitSymbol}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-blue-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Rainfall:
              </span>
              <span className="font-bold text-slate-200">{data.precipitation.toFixed(1)} mm</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="temperature-chart-container"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              7-Day Temperature Trends
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare expected high and low trajectory across the week
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            id="toggle-precip-overlay-btn"
            onClick={() => setShowPrecipitationBar(!showPrecipitationBar)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              showPrecipitationBar
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Rainfall Bars {showPrecipitationBar ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                const clickedDate = state.activePayload[0].payload.date;
                onSelectDate(clickedDate);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={6}
            />

            {/* Left Y Axis for Temperature */}
            <YAxis
              yAxisId="temp"
              domain={[yMin, yMax]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${v}${unitSymbol}`}
            />

            {/* Right Y Axis for Precipitation (mm) */}
            {showPrecipitationBar && (
              <YAxis
                yAxisId="precip"
                orientation="right"
                domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 1.5))]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#93c5fd', fontSize: 11 }}
                tickFormatter={(v) => `${v}mm`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              iconType="circle"
            />

            {/* Optional Precipitation bars */}
            {showPrecipitationBar && (
              <Bar
                yAxisId="precip"
                dataKey="precipitation"
                name="Rainfall (mm)"
                fill="#bfdbfe"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            )}

            {/* High Temp Line */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="tempMax"
              name={`Max Temp (${unitSymbol})`}
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 7, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Low Temp Line */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="tempMin"
              name={`Min Temp (${unitSymbol})`}
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 7, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Click on any day in the chart or cards to highlight specific daily conditions.
        </span>
        <span className="hidden sm:inline">Unit: {unit === 'celsius' ? 'Metric (°C, mm)' : 'Imperial (°F, mm)'}</span>
      </div>
    </div>
  );
};
