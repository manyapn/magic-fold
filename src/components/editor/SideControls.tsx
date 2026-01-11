"use client";

// Icons
const ChevronUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface SideControlsProps {
  onPrevPanel: () => void;
  onNextPanel: () => void;
  onSave: () => void;
  onClear: () => void;
  currentPanelLabel: string;
}

export default function SideControls({
  onPrevPanel,
  onNextPanel,
  onSave,
  onClear,
  currentPanelLabel,
}: SideControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Panel navigation */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onPrevPanel}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[var(--color-mauve)] shadow-sm transition-all duration-150 hover:shadow-md"
          aria-label="Previous panel"
        >
          <ChevronUpIcon />
        </button>

        <span className="text-xs text-[var(--color-mauve)] font-medium px-2 py-1 bg-white/50 rounded">
          {currentPanelLabel}
        </span>

        <button
          onClick={onNextPanel}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[var(--color-mauve)] shadow-sm transition-all duration-150 hover:shadow-md"
          aria-label="Next panel"
        >
          <ChevronDownIcon />
        </button>
      </div>

      {/* Save button */}
      <div className="relative group/save">
        <button
          onClick={onSave}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-mauve)] hover:brightness-110 text-white shadow-md transition-all duration-150 hover:shadow-lg"
          aria-label="Save to main screen"
        >
          <SaveIcon />
        </button>
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[var(--color-mauve-dark)] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/save:opacity-100 pointer-events-none transition-opacity">
          Save to main screen
        </div>
      </div>

      {/* Clear button */}
      <div className="relative group/clear">
        <button
          onClick={onClear}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-[var(--color-mauve)] shadow-sm transition-all duration-150 hover:shadow-md"
          aria-label="Clear canvas"
        >
          <TrashIcon />
        </button>
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[var(--color-mauve-dark)] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/clear:opacity-100 pointer-events-none transition-opacity">
          Clear canvas
        </div>
      </div>
    </div>
  );
}
