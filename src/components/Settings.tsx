import { FC, useState } from 'react';
import { ColorScheme } from '@/app/page';

interface SettingsProps {
  numCards: number;
  onNumCardsChange: (count: number) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  refreshTime: number;
  onRefreshTimeChange: (seconds: number) => void;
}

const Settings: FC<SettingsProps> = ({
  numCards,
  onNumCardsChange,
  colorScheme,
  onColorSchemeChange,
  refreshTime,
  onRefreshTimeChange,
}) => {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');

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
    <div className="p-6 min-w-[280px]">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Scheme
          </label>
          <div className="flex flex-col gap-2">
            {schemeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onColorSchemeChange(option.value)}
                className={`px-4 py-2 rounded-lg text-left transition-all duration-200
                  ${colorScheme === option.value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Refresh Time
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {refreshTimeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeOptionClick(option.value)}
                  className={`px-4 py-2 rounded-lg flex-1 transition-all duration-200
                    ${(!showCustomTime && refreshTime === option.value) || (showCustomTime && option.value === -1)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {showCustomTime && (
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border-2 border-blue-200 focus-within:border-blue-500 transition-colors">
                <input
                  type="number"
                  min="1"
                  value={customTime}
                  onChange={handleCustomTimeChange}
                  className="w-full px-3 py-2 text-gray-800 bg-white rounded-md
                           focus:outline-none text-lg font-medium"
                  placeholder="Enter seconds"
                />
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  seconds
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Cards
          </label>
          <div className="flex gap-2">
            {[3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onNumCardsChange(num)}
                className={`px-4 py-2 rounded-lg flex-1 transition-all duration-200
                  ${numCards === num
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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