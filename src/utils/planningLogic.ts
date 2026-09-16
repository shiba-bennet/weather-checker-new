import { ProcessedWeatherData, SmartRecommendation } from '../types';

export function generateSmartRecommendations(data: ProcessedWeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const current = data.current;
  const today = data.daily[0];
  const precip = today ? today.precipitation : current.precipitationToday;
  const maxWind = today ? today.windspeedMax : current.windspeed;
  const temp = current.temperature;
  const weatherCode = current.weathercode;

  // 1. Umbrella Advice
  const isRainCode = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  if (precip >= 3.0 || isRainCode && precip >= 1.0) {
    recommendations.push({
      id: 'umbrella-needed',
      category: 'umbrella',
      title: 'Umbrella Essential',
      description: `Steady rain expected today (${precip.toFixed(1)} mm precipitation). Keep an umbrella or waterproof shell with you.`,
      status: 'warning',
      icon: 'Umbrella',
      metric: `${precip.toFixed(1)} mm rain`,
    });
  } else if (precip > 0.2 || isRainCode) {
    recommendations.push({
      id: 'umbrella-caution',
      category: 'umbrella',
      title: 'Pack a Compact Umbrella',
      description: `Light precipitation or intermittent drizzle (${precip.toFixed(1)} mm) possible throughout the day.`,
      status: 'caution',
      icon: 'Umbrella',
      metric: `${precip.toFixed(1)} mm rain`,
    });
  } else {
    recommendations.push({
      id: 'umbrella-dry',
      category: 'umbrella',
      title: 'No Umbrella Needed',
      description: 'Precipitation is near zero today. Clear streets and dry outdoor conditions ahead.',
      status: 'safe',
      icon: 'Sun',
      metric: '0 mm rain',
    });
  }

  // 2. Wind Warnings & Advice
  if (maxWind >= 50 || current.windspeed >= 40) {
    recommendations.push({
      id: 'wind-warning',
      category: 'wind',
      title: 'High Wind Warning',
      description: `Potentially damaging gusts reaching ${Math.round(maxWind)} km/h. Secure loose balconies, bikes, and outdoor furniture.`,
      status: 'warning',
      icon: 'Wind',
      metric: `${Math.round(maxWind)} km/h gusts`,
    });
  } else if (maxWind >= 30 || current.windspeed >= 25) {
    recommendations.push({
      id: 'wind-caution',
      category: 'wind',
      title: 'Breezy & Gusty',
      description: `Noticeable winds up to ${Math.round(maxWind)} km/h. Cycling or holding umbrellas may meet stiff resistance.`,
      status: 'caution',
      icon: 'Wind',
      metric: `${Math.round(maxWind)} km/h`,
    });
  } else {
    recommendations.push({
      id: 'wind-safe',
      category: 'wind',
      title: 'Gentle Breezes',
      description: `Calm to moderate air flow at ${Math.round(current.windspeed)} km/h. Great conditions for outdoor walks or cycling.`,
      status: 'safe',
      icon: 'Compass',
      metric: `${Math.round(current.windspeed)} km/h`,
    });
  }

  // 3. Clothing & Layering Advice
  if (temp < 5) {
    recommendations.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Heavy Winter Insulation',
      description: 'Freezing/near-freezing temperatures. Bundle up with thermal baselayers, insulated parka, scarf, and warm gloves.',
      status: 'caution',
      icon: 'ThermometerSnowflake',
      metric: `${Math.round(temp)}°C`,
    });
  } else if (temp < 15) {
    recommendations.push({
      id: 'clothing-cool',
      category: 'clothing',
      title: 'Layer with a Jacket',
      description: 'Crisp and chilly conditions. A fleece, trench coat, or knit sweater will keep you comfortable outdoors.',
      status: 'info',
      icon: 'Shirt',
      metric: `${Math.round(temp)}°C`,
    });
  } else if (temp < 25) {
    recommendations.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Comfortable Light Layers',
      description: 'Pleasant and temperate weather. Standard cotton tops, chinos, or jeans are ideal; keep a light cardigan for sunset.',
      status: 'safe',
      icon: 'Smile',
      metric: `${Math.round(temp)}°C`,
    });
  } else {
    recommendations.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Light Breathable Attire',
      description: 'Warm to hot weather. Wear loose linen/cotton, apply sunscreen, wear UV sunglasses, and carry a water bottle.',
      status: 'caution',
      icon: 'SunMedium',
      metric: `${Math.round(temp)}°C`,
    });
  }

  // 4. Outdoor Activity Index
  let outdoorScore = 10;
  if (precip > 5) outdoorScore -= 5;
  else if (precip > 1) outdoorScore -= 3;
  else if (precip > 0.2) outdoorScore -= 1;

  if (maxWind > 45) outdoorScore -= 3;
  else if (maxWind > 30) outdoorScore -= 1;

  if (temp < 2 || temp > 34) outdoorScore -= 3;
  else if (temp < 8 || temp > 28) outdoorScore -= 1;

  outdoorScore = Math.max(1, Math.min(10, outdoorScore));

  let activityStatus: 'safe' | 'caution' | 'warning' | 'info' = 'safe';
  let activityTitle = 'Ideal for Outdoor Activities';
  let activityDesc = 'Prime conditions for running, cycling, outdoor lunching, or weekend walks.';

  if (outdoorScore <= 4) {
    activityStatus = 'warning';
    activityTitle = 'Poor Outdoor Conditions';
    activityDesc = 'Rain, harsh winds, or temperature extremes make indoor training or gym sessions preferable.';
  } else if (outdoorScore <= 7) {
    activityStatus = 'caution';
    activityTitle = 'Fair Outdoor Window';
    activityDesc = 'Moderate conditions. Keep workouts shorter and monitor changing skies.';
  }

  recommendations.push({
    id: 'outdoor-index',
    category: 'outdoor',
    title: activityTitle,
    description: activityDesc,
    status: activityStatus,
    icon: 'Activity',
    metric: `${outdoorScore}/10 Comfort`,
  });

  // 5. Best Day in 7-day outlook
  if (data.daily && data.daily.length > 1) {
    // Find the day with lowest precipitation and pleasant temp
    const candidates = data.daily.slice(1); // look ahead next 6 days
    let bestDay = candidates[0];
    let bestScore = -999;

    candidates.forEach((d) => {
      // Score formula: high max temp within 18-24 is ideal, heavy penalties for rain and wind
      const tempDiff = Math.abs(d.tempMax - 22);
      const score = 30 - tempDiff * 1.5 - d.precipitation * 4 - (d.windspeedMax > 25 ? (d.windspeedMax - 25) * 0.5 : 0);
      if (score > bestScore) {
        bestScore = score;
        bestDay = d;
      }
    });

    if (bestDay) {
      recommendations.push({
        id: 'best-day',
        category: 'sun',
        title: `Prime Day: ${bestDay.dayName}`,
        description: `${bestDay.dayName} (${bestDay.shortDate}) looks the most favorable with ${bestDay.tempMax}°C max, ${bestDay.precipitation.toFixed(1)} mm rain, and gentle breeze.`,
        status: 'safe',
        icon: 'Sparkles',
        metric: `${bestDay.tempMax}°C max`,
      });
    }
  }

  return recommendations;
}
