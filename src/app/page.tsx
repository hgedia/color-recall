'use client';

import { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';
import ColorCard from '@/components/ColorCard';
import Settings from '@/components/Settings';
import { Cog6ToothIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

export type ColorScheme = 'complementary' | 'monochromatic' | 'analogous' | 'triadic';

function isColorTooSimilar(newColor: string, existingColors: string[]): boolean {
  const MIN_DISTANCE = 50; // Increased minimum distance in LAB color space
  return existingColors.some(existingColor => {
    const distance = chroma.distance(newColor, existingColor, 'lab');
    return distance < MIN_DISTANCE;
  });
}

function generateColorByScheme(baseHue: number, scheme: ColorScheme, index: number): string {
  let hue: number;
  let saturation: number;
  let brightness: number;

  switch (scheme) {
    case 'complementary':
      // For complementary colors, ensure high saturation and brightness
      // and rotate by 180 degrees plus a small offset for additional colors
      hue = (baseHue + 180 + (index > 1 ? (index - 1) * 30 : 0)) % 360;
      saturation = 0.85 + (Math.random() * 0.15); // Higher saturation
      brightness = 0.75 + (Math.random() * 0.25);
      break;

    case 'monochromatic':
      // Keep the same hue, vary saturation and brightness
      hue = baseHue;
      saturation = 0.3 + (index * 0.2) + (Math.random() * 0.2);
      brightness = 0.4 + (index * 0.15) + (Math.random() * 0.2);
      break;

    case 'analogous':
      // Rotate by 30 degrees for analogous colors
      hue = (baseHue + (30 * (index - 1))) % 360;
      saturation = 0.7 + Math.random() * 0.3;
      brightness = 0.7 + Math.random() * 0.3;
      break;

    case 'triadic':
      // Rotate by 120 degrees for triadic colors
      hue = (baseHue + (120 * index)) % 360;
      saturation = 0.75 + Math.random() * 0.25;
      brightness = 0.75 + Math.random() * 0.25;
      break;

    default:
      hue = baseHue;
      saturation = 0.75;
      brightness = 0.75;
  }

  return chroma.hsv(hue, saturation, brightness).hex();
}

function generateRandomColors(count: number, scheme: ColorScheme): string[] {
  const colors: string[] = [];
  const baseHue = Math.random() * 360;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (colors.length < count && attempts < MAX_ATTEMPTS) {
    const newColor = generateColorByScheme(baseHue, scheme, colors.length);
    
    if (!isColorTooSimilar(newColor, colors)) {
      colors.push(newColor);
    }
    
    attempts++;
  }

  // If we couldn't generate enough unique colors, adjust the remaining ones
  while (colors.length < count) {
    const newColor = chroma.random().hex();
    if (!isColorTooSimilar(newColor, colors)) {
      colors.push(newColor);
    }
  }

  return colors;
}

export default function Home() {
  const [numCards, setNumCards] = useState(3);
  const [cardSize] = useState(400); // Fixed size
  const [colorScheme, setColorScheme] = useState<ColorScheme>('complementary');
  const [colors, setColors] = useState(() => generateRandomColors(3, 'complementary'));
  const [showSettings, setShowSettings] = useState(false);
  const [refreshTime, setRefreshTime] = useState(5); // Default 5 seconds
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(refreshTime);

  const generateNewColors = useCallback(() => {
    setColors(generateRandomColors(numCards, colorScheme));
    setCountdown(refreshTime); // Reset countdown after generating new colors
  }, [numCards, colorScheme, refreshTime]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let countdownId: NodeJS.Timeout | null = null;

    if (isAutoRefreshing) {
      setCountdown(refreshTime); // Initialize countdown
      intervalId = setInterval(generateNewColors, refreshTime * 1000);
      
      // Update countdown every second
      countdownId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) return refreshTime;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (countdownId) clearInterval(countdownId);
    };
  }, [isAutoRefreshing, refreshTime, generateNewColors]);

  // Reset countdown when refresh time changes
  useEffect(() => {
    if (isAutoRefreshing) {
      setCountdown(refreshTime);
    }
  }, [refreshTime, isAutoRefreshing]);

  const handleNumCardsChange = (newCount: number) => {
    setNumCards(newCount);
    setColors(generateRandomColors(newCount, colorScheme));
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    setColors(generateRandomColors(numCards, scheme));
  };

  const handleRefreshTimeChange = (seconds: number) => {
    setRefreshTime(seconds);
    if (isAutoRefreshing) {
      setCountdown(seconds);
    }
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshing(prev => !prev);
    if (!isAutoRefreshing) {
      setCountdown(refreshTime);
    }
  };

  const getSchemeDisplayName = (scheme: ColorScheme): string => {
    return scheme.charAt(0).toUpperCase() + scheme.slice(1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 relative">
      <div className="w-full max-w-[1600px] flex flex-col">
        <div className="w-full flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-bold">
              Color Flash Cards
            </h1>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
              <span className="font-medium text-gray-700">Scheme:</span>
              <span className="font-medium text-blue-600">
                {getSchemeDisplayName(colorScheme)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all duration-300 shadow-md
                       ${showSettings 
                         ? 'bg-blue-500 text-white' 
                         : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            aria-label="Settings"
          >
            <Cog6ToothIcon className={`w-6 h-6 ${showSettings ? 'rotate-180' : ''} transition-transform duration-300`} />
          </button>
        </div>

        {showSettings && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl">
              <Settings
                numCards={numCards}
                onNumCardsChange={handleNumCardsChange}
                colorScheme={colorScheme}
                onColorSchemeChange={handleColorSchemeChange}
                refreshTime={refreshTime}
                onRefreshTimeChange={handleRefreshTimeChange}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 w-full flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-6">
                {isAutoRefreshing && (
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {countdown}
                    </div>
                    <div className="text-sm font-medium text-blue-600 whitespace-nowrap">
                      seconds
                    </div>
                  </div>
                )}

                <button
                  onClick={toggleAutoRefresh}
                  className={`px-8 py-4 rounded-lg transition-all duration-300
                           font-semibold shadow-lg hover:shadow-xl
                           flex items-center gap-2 text-lg
                           ${isAutoRefreshing 
                             ? 'bg-red-500 hover:bg-red-600 text-white' 
                             : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                  {isAutoRefreshing ? (
                    <>
                      <StopIcon className="w-6 h-6" />
                      Stop
                    </>
                  ) : (
                    <>
                      <PlayIcon className="w-6 h-6" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center gap-4">
            {colors.map((color, index) => (
              <ColorCard 
                key={`${color}-${index}`}
                color={color}
                size={cardSize}
              />
            ))}
          </div>
        </div>
      </div>

      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
