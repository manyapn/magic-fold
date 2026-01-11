"use client";

import Image from "next/image";
import { PanelData } from "@/types/zine";

interface PanelProps {
  panel: PanelData;
  showLabel: boolean;
  onClick: () => void;
}

export default function Panel({ panel, showLabel, onClick }: PanelProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-[3/4] bg-white
        hover:brightness-95
        active:scale-[0.99]
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-[var(--color-mauve)] focus:ring-offset-2
        overflow-hidden
        ${panel.isUpsideDown ? "rotate-180" : ""}
      `}
    >
      {/* Canvas thumbnail preview */}
      {panel.thumbnail && (
        <Image
          src={panel.thumbnail}
          alt={`${panel.label} panel preview`}
          fill
          className="object-cover"
          unoptimized
        />
      )}

      {/* Label overlay - stays rotated with the panel */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[var(--color-mauve)] text-sm font-medium opacity-60">
            {panel.label}
          </span>
        </div>
      )}
    </button>
  );
}
