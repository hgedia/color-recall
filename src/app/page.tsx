'use client';

import { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';
import ColorCard from '@/components/ColorCard';
import Settings from '@/components/Settings';
import { Cog6ToothIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

export type ColorScheme = 'complementary' | 'monochromatic' | 'analogous' | 'triadic' | 'gamutMask';

// Define gamut mask names for better UX
export const gamutMaskNames = [
  'Complementary Split',
  'Triadic Split',
  'Y-Shape Split',
  'Analogous Slice'
];

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

    case 'gamutMask':
      // Get the current gamut mask index from state
      const gamutMaskIndex = window.gamutMaskState !== undefined ? window.gamutMaskState : 0;
      
      // Define a few classic gamut mask shapes
      const gamutMasks = [
        // Complementary - a narrow shape across the color wheel
        (h: number) => {
          const angle = (h - baseHue + 360) % 360;
          return (angle < 60 || (angle > 170 && angle < 230));
        },
        // Triadic - three areas spaced 120° apart
        (h: number) => {
          const angle = (h - baseHue + 360) % 360;
          return (angle < 40 || (angle > 115 && angle < 155) || (angle > 235 && angle < 275));
        },
        // Split complementary - a Y shape
        (h: number) => {
          const angle = (h - baseHue + 360) % 360;
          return (angle < 50 || (angle > 150 && angle < 190) || (angle > 200 && angle < 240));
        },
        // Analogous - a slice of the color wheel
        (h: number) => {
          const angle = (h - baseHue + 360) % 360;
          return (angle < 90);
        }
      ];
      
      // Select a mask shape based on the global state
      const selectedMask = gamutMasks[gamutMaskIndex % gamutMasks.length];
      
      // Generate a random hue, but keep trying until it falls within the mask shape
      let masked = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 100;
      
      // Initialize hue with a default value
      hue = baseHue;
      
      while (!masked && attempts < MAX_ATTEMPTS) {
        // Try a random hue within the 360° range
        const testHue = Math.random() * 360;
        masked = selectedMask(testHue);
        if (masked) {
          hue = testHue;
        }
        attempts++;
      }
      
      // If we couldn't find a color within the mask, hue will remain at baseHue
      
      // For colors within the mask, use high saturation and brightness
      saturation = 0.7 + Math.random() * 0.3;
      brightness = 0.7 + Math.random() * 0.3;
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

// Create a global state for gamut mask index (since we can't pass it directly to the function)
declare global {
  interface Window {
    gamutMaskState?: number;
  }
}

export default function Home() {
  const [numCards, setNumCards] = useState(3);
  const [cardSize] = useState(400); // Fixed size
  const [colorScheme, setColorScheme] = useState<ColorScheme>('complementary');
  const [colors, setColors] = useState<string[]>([]);  // Initialize as empty array
  const [showSettings, setShowSettings] = useState(false);
  const [refreshTime, setRefreshTime] = useState(5); // Default 5 seconds
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(refreshTime);
  const [currentGamutMask, setCurrentGamutMask] = useState(0);

  // Initialize colors on client side only
  useEffect(() => {
    setColors(generateRandomColors(numCards, colorScheme));
  }, []); // Empty dependency array for initial render only

  // Set the global gamut mask state whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gamutMaskState = currentGamutMask;
    }
  }, [currentGamutMask]);

  const generateNewColors = useCallback(() => {
    // Remove the automatic rotation of gamut masks
    // This way the mask stays the same until manually changed by the user
    // if (colorScheme === 'gamutMask') {
    //   // Rotate through the different gamut masks
    //   setCurrentGamutMask((prev) => (prev + 1) % gamutMaskNames.length);
    // }
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

  const handleGamutMaskChange = (index: number) => {
    setCurrentGamutMask(index);
    if (typeof window !== 'undefined') {
      window.gamutMaskState = index;
    }
    // Generate new colors using the selected mask
    setColors(generateRandomColors(numCards, colorScheme));
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshing(prev => !prev);
    if (!isAutoRefreshing) {
      setCountdown(refreshTime);
    }
  };

  const getSchemeDisplayName = (scheme: ColorScheme): string => {
    if (scheme === 'gamutMask') {
      return `Gamut Mask: ${gamutMaskNames[currentGamutMask]}`;
    }
    return scheme.charAt(0).toUpperCase() + scheme.slice(1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 relative 
                    bg-gradient-to-b from-gray-50 to-white
                    dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-[1600px] flex flex-col">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 mb-8 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-blue-600 to-blue-400
                          dark:from-blue-400 dark:to-blue-300">
              Color Flash Cards
            </h1>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 
                          backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm 
                          border border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheme</span>
              <span className="text-sm font-semibold bg-gradient-to-r 
                             from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 
                             bg-clip-text text-transparent">
                {getSchemeDisplayName(colorScheme)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl transition-all duration-300 
                       shadow-lg hover:shadow-xl hover:scale-105 
                       ${showSettings 
                         ? 'bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-400 text-white' 
                         : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            aria-label="Settings"
          >
            <Cog6ToothIcon className={`w-6 h-6 ${showSettings ? 'rotate-180' : ''} transition-transform duration-300`} />
          </button>
        </div>

        {showSettings && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] sm:w-auto">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg 
                          border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl
                          max-h-[80vh] overflow-y-auto">
              <Settings
                numCards={numCards}
                onNumCardsChange={handleNumCardsChange}
                colorScheme={colorScheme}
                onColorSchemeChange={handleColorSchemeChange}
                refreshTime={refreshTime}
                onRefreshTimeChange={handleRefreshTimeChange}
                currentGamutMask={currentGamutMask}
                onGamutMaskChange={handleGamutMaskChange}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 w-full flex flex-col items-center gap-8">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-lg">
              {isAutoRefreshing && (
                <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 
                              backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg 
                              border border-gray-100 dark:border-gray-700
                              w-full sm:w-auto justify-center">
                  <div className="text-4xl font-bold bg-gradient-to-r 
                                from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 
                                bg-clip-text text-transparent">
                    {countdown}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    seconds
                  </div>
                </div>
              )}

              <button
                onClick={toggleAutoRefresh}
                className={`px-8 py-4 rounded-xl transition-all duration-300
                         font-semibold shadow-lg hover:shadow-xl hover:scale-105
                         flex items-center gap-3 text-lg w-full sm:w-auto justify-center
                         ${isAutoRefreshing 
                           ? 'bg-gradient-to-r from-red-500 to-red-400 dark:from-red-600 dark:to-red-500 text-white' 
                           : 'bg-gradient-to-r from-green-500 to-green-400 dark:from-green-600 dark:to-green-500 text-white'}`}
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
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
          className="fixed inset-0 bg-black/30 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
