"use client";

import { useRef } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/80 transition-all duration-150 shadow-sm"
        aria-label="Color picker"
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: value }}
        />
      </button>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={handleColorChange}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
