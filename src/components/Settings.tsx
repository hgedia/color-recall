import { FC, useState } from 'react';
import { ColorScheme } from '@/app/page';
import { useTheme } from '@/app/ThemeContext';
import { MoonIcon, SunIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Import gamut mask names from page.tsx for consistency
import { gamutMaskNames } from '@/app/page';

interface SettingsProps {
  numCards: number;
  onNumCardsChange: (count: number) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  refreshTime: number;
  onRefreshTimeChange: (seconds: number) => void;
  currentGamutMask?: number;
  onGamutMaskChange?: (index: number) => void;
}

const Settings: FC<SettingsProps> = ({
  numCards,
  onNumCardsChange,
  colorScheme,
  onColorSchemeChange,
  refreshTime,
  onRefreshTimeChange,
  currentGamutMask = 0,
  onGamutMaskChange = () => {},
}) => {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const { isDarkMode, toggleDarkMode } = useTheme();

  const sizeOptions = [
    { value: 400, label: 'Small' },
  ];

  const refreshTimeOptions = [
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
    { value: -1, label: 'Custom' },
  ];

  const schemeOptions: { value: ColorScheme; label: string }[] = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'monochromatic', label: 'Monochromatic' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'gamutMask', label: 'Gamut Mask' },
  ];

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTime(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onRefreshTimeChange(numValue);
    }
  };

  const handleTimeOptionClick = (value: number) => {
    if (value === -1) {
      setShowCustomTime(true);
      setCustomTime(refreshTime.toString());
    } else {
      setShowCustomTime(false);
      onRefreshTimeChange(value);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-w-[280px] max-w-full sm:max-w-none dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Settings</h2>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-all duration-300
                   bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {schemeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onColorSchemeChange(option.value)}
                className={`px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${colorScheme === option.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {colorScheme === 'gamutMask' && (
            <>
              <div className="mt-4 mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gamut Mask Type
                </label>
                <div className="grid grid-cols-1 mt-2 gap-2">
                  {gamutMaskNames.map((name: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => onGamutMaskChange(index)}
                      className={`px-4 py-2 rounded-lg text-left transition-all duration-200 text-sm
                      ${currentGamutMask === index
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Gamut Mask</p>
                    <p>Colors are limited to specific shapes on the color wheel, based on James Gurney's color theory. This creates harmonic color schemes by restricting the range of available colors.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Refresh Time
          </label>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              {refreshTimeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeOptionClick(option.value)}
                  className={`px-3 py-3 rounded-lg text-center transition-all duration-200
                    ${(!showCustomTime && refreshTime === option.value) || (showCustomTime && option.value === -1)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {showCustomTime && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg 
                            border-2 border-blue-200 dark:border-blue-900 
                            focus-within:border-blue-500 dark:focus-within:border-blue-400 
                            transition-colors">
                <input
                  type="number"
                  min="1"
                  value={customTime}
                  onChange={handleCustomTimeChange}
                  className="w-full px-3 py-2 text-gray-800 dark:text-gray-200 
                           bg-white dark:bg-gray-800 rounded-md
                           focus:outline-none text-lg font-medium"
                  placeholder="Enter seconds"
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  seconds
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Number of Cards
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onNumCardsChange(num)}
                className={`px-3 py-3 rounded-lg text-center transition-all duration-200
                  ${numCards === num
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 