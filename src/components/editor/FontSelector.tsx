"use client";

import { FontFamily, FONT_OPTIONS } from "@/types/editor";

interface FontSelectorProps {
  value: FontFamily;
  onChange: (font: FontFamily) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export default function FontSelector({
  value,
  onChange,
  fontSize,
  onFontSizeChange,
}: FontSelectorProps) {
  const handleDecrease = () => {
    onFontSizeChange(Math.max(12, fontSize - 2));
  };

  const handleIncrease = () => {
    onFontSizeChange(Math.min(72, fontSize + 2));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 w-35">
      {/* Font options - shown immediately */}
      <div className="space-y-0.5 mb-2">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.id}
            onClick={() => onChange(font.id)}
            className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
              value === font.id
                ? "bg-pink-light text-mauve-dark"
                : "hover:bg-gray-50 text-mauve"
            }`}
          >
            <span
              className="block text-sm"
              style={{ fontFamily: `var(--font-${font.id})` }}
            >
              {font.name}
            </span>
          </button>
        ))}
      </div>

      {/* Font size with +/- buttons */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={handleDecrease}
            className="w-6 h-6 rounded-full bg-[var(--color-pink-light)] text-[var(--color-mauve-dark)] text-sm font-bold hover:brightness-95 transition-all flex items-center justify-center"
            aria-label="Decrease font size"
          >
            −
          </button>
          <span className="text-xs text-[var(--color-mauve-dark)] font-medium text-center">
            {fontSize}
          </span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 rounded-full bg-[var(--color-pink-light)] text-[var(--color-mauve-dark)] text-sm font-bold hover:brightness-95 transition-all flex items-center justify-center"
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
