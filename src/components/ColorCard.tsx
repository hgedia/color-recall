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

  return (
    <div 
      onClick={handleClick}
      className="group relative h-[calc(100vh-12rem)] rounded-lg shadow-lg 
                cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        width: size,
        backgroundColor: color
      }}
    >
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/50 text-white 
                  py-2 px-3 rounded-b-lg opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 text-center"
      >
        <span className="font-mono text-sm uppercase">
          {copied ? 'Copied!' : color}
        </span>
      </div>
    </div>
  );
};

export default ColorCard; 