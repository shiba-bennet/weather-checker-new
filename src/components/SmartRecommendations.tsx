import React from 'react';
import {
  Umbrella,
  Wind,
  Shirt,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sun,
  ThermometerSnowflake,
  SunMedium,
  Compass,
  Smile,
} from 'lucide-react';
import { SmartRecommendation } from '../types';

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
}) => {
  const getIcon = (iconName: string, status: string) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Umbrella':
        return <Umbrella {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'Shirt':
        return <Shirt {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake {...props} />;
      case 'SunMedium':
        return <SunMedium {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Smile':
        return <Smile {...props} />;
      default:
        return <Info {...props} />;
    }
  };

  const getStatusBadge = (status: SmartRecommendation['status']) => {
    switch (status) {
      case 'warning':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          badge: 'bg-red-100 text-red-800',
          iconBg: 'bg-red-100 text-red-600',
          tag: 'Advisory',
          statusIcon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      case 'caution':
        return {
          bg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          badge: 'bg-amber-100 text-amber-800',
          iconBg: 'bg-amber-100 text-amber-700',
          tag: 'Caution',
          statusIcon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      case 'safe':
        return {
          bg: 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800',
          iconBg: 'bg-emerald-100 text-emerald-700',
          tag: 'Favorable',
          statusIcon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-sky-50/60 border-sky-200 text-sky-950',
          badge: 'bg-sky-100 text-sky-800',
          iconBg: 'bg-sky-100 text-sky-700',
          tag: 'Optimal',
          statusIcon: <Info className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <div id="smart-recommendations-section" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Smart Planning Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Actionable daily recommendations based on real-time atmospheric modeling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {recommendations.map((item) => {
          const styling = getStatusBadge(item.status);

          return (
            <div
              key={item.id}
              id={`rec-card-${item.id}`}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${styling.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${styling.iconBg}`}>
                      {getIcon(item.icon, item.status)}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${styling.badge}`}
                  >
                    {styling.statusIcon}
                    {styling.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.metric && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Observed Index</span>
                  <span className="font-bold text-slate-800 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                    {item.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
