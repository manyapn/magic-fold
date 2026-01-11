"use client";

import Link from "next/link";

interface HeaderProps {
  onPreview?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function Header({ onPreview, onDownload, onShare }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link
        href="/"
        className="font-(family-name:--font-luckiest-guy) text-xl text-mauve-dark tracking-wide hover:opacity-80 transition-opacity"
      >
        MAGIC FOLD
      </Link>

      <div className="flex gap-2">
        <button
          onClick={onPreview}
          className="px-4 py-1.5 rounded-lg bg-[#AE7580] text-[#FFFCFB] font-(family-name:--font-mada) text-[1rem] font-extrabold text-center hover:brightness-95 active:scale-[0.98] transition-all duration-100"
        >
          Preview
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-1.5 rounded-lg bg-[#AE7580] text-[#FFFCFB] font-(family-name:--font-mada) text-[1rem] font-extrabold text-center hover:brightness-95 active:scale-[0.98] transition-all duration-100"
        >
          Download
        </button>
        <button
          onClick={onShare}
          className="px-4 py-1.5 rounded-full bg-[#AE7580] text-[#FFFCFB] font-(family-name:--font-mada) text-[1rem] font-extrabold text-center hover:brightness-95 active:scale-[0.98] transition-all duration-100"
        >
          Share
        </button>
      </div>
    </header>
  );
}
