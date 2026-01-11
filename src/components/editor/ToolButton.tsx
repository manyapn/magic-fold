"use client";

import { ReactNode } from "react";

interface ToolButtonProps {
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  label: string;
}

export default function ToolButton({ icon, isActive, onClick, onDoubleClick, label }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      aria-label={label}
      aria-pressed={isActive}
      className={`
        w-12 h-12 rounded-full flex items-center justify-center
        transition-all duration-150
        ${isActive
          ? "bg-white shadow-md text-[var(--color-mauve-dark)]"
          : "bg-white/50 text-[var(--color-mauve)] hover:bg-white/80"
        }
      `}
    >
      {icon}
    </button>
  );
}
