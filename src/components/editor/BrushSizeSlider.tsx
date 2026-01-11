"use client";

interface BrushSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function BrushSizeSlider({
  value,
  onChange,
  min = 1,
  max = 50,
}: BrushSizeSliderProps) {
  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-lg py-3 px-3 shadow-md">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          writingMode: "vertical-lr",
          direction: "rtl",
        }}
        className="h-28 w-2 appearance-none bg-[var(--color-pink-light)] rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--color-mauve)]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--color-mauve)]
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:border-0"
        aria-label="Brush size"
      />
      <span className="text-xs text-[var(--color-mauve)] font-medium w-10 text-center">
        {value}
      </span>
    </div>
  );
}
