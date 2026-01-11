"use client";

interface LabelToggleProps {
  showLabels: boolean;
  onToggle: () => void;
  onClearAll?: () => void;
}

export default function LabelToggle({ showLabels, onToggle, onClearAll }: LabelToggleProps) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3">
      {onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-sm font-medium text-[var(--color-mauve-dark)] hover:bg-white hover:shadow-lg active:scale-[0.98] transition-all duration-150"
          aria-label="Clear all panels"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Clear All</span>
        </button>
      )}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-sm font-medium text-[var(--color-mauve-dark)] hover:bg-white hover:shadow-lg active:scale-[0.98] transition-all duration-150"
        aria-label={showLabels ? "Hide labels" : "Show labels"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={showLabels ? "opacity-100" : "opacity-50"}
        >
          {showLabels ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </>
          )}
        </svg>
        <span>{showLabels ? "Hide Labels" : "Show Labels"}</span>
      </button>
    </div>
  );
}
