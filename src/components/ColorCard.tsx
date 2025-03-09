import { FC, useState } from 'react';

interface ColorCardProps {
  color: string;
  size: number;
}

const ColorCard: FC<ColorCardProps> = ({ color, size }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy color code:', err);
    }
  };

  // Don't render anything if no color is provided yet
  if (!color) {
    return null;
  }

  return (
    <div 
      onClick={handleClick}
      className="group relative h-[calc(100vh-12rem)] rounded-lg shadow-lg 
                cursor-pointer transition-all duration-300 hover:scale-105
                dark:shadow-gray-900/30"
      style={{
        width: size,
        backgroundColor: color
      }}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm
                  py-3 px-4 rounded-b-lg opacity-0 group-hover:opacity-100
                  transition-all duration-300 text-center transform
                  group-hover:translate-y-0 translate-y-2"
      >
        <span className="font-mono text-sm font-medium tracking-wider uppercase
                       bg-white/10 dark:bg-white/20 px-3 py-1.5 rounded-full text-white">
          {copied ? 'Copied!' : color}
        </span>
      </div>
    </div>
  );
};

export default ColorCard; 