"use client";

import { useRef, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import { useZineStorage } from "@/hooks/useZineStorage";
import { PanelPosition } from "@/types/zine";

// Page order for the flip book viewer
const PAGE_ORDER: PanelPosition[] = [
  "front",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "back",
];

// Page component that forwards ref (required by react-pageflip)
const Page = forwardRef<HTMLDivElement, { thumbnail: string | null; label: string }>(
  function Page({ thumbnail, label }, ref) {
    return (
      <div
        ref={ref}
        className="bg-white shadow-md flex items-center justify-center overflow-hidden"
        style={{ width: "100%", height: "100%" }}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${label} page`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-50">
            <span className="text-[var(--color-mauve)]/40 text-lg font-medium">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }
);

export default function PreviewPage() {
  const { zine, isLoading } = useZineStorage();
  const bookRef = useRef<any>(null);

  const handlePrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  if (isLoading || !zine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[var(--color-mauve)] text-lg"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-luckiest-guy)] text-xl text-[var(--color-mauve-dark)] tracking-wide hover:opacity-80 transition-opacity"
        >
          MAGIC FOLD
        </Link>
        <Link
          href="/create"
          className="px-4 py-1.5 rounded-lg bg-[#AE7580] text-[#FFFCFB] font-[family-name:var(--font-mada)] text-[1rem] font-extrabold text-center hover:brightness-95 active:scale-[0.98] transition-all duration-100"
        >
          BACK TO EDITOR
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-luckiest-guy)] text-2xl md:text-3xl text-[var(--color-mauve-dark)] mb-8 text-center"
        >
          PREVIEW YOUR ZINE
        </motion.h2>

        {/* Flip book container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-6"
        >
          <div>
            {/* @ts-expect-error - react-pageflip has incomplete types */}
            <HTMLFlipBook
              ref={bookRef}
              width={240}
              height={320}
              size="stretch"
              minWidth={200}
              maxWidth={300}
              minHeight={267}
              maxHeight={400}
              showCover={true}
              mobileScrollSupport={true}
              className=""
              flippingTime={600}
              usePortrait={false}
              startPage={0}
              drawShadow={true}
              maxShadowOpacity={0.5}
              showPageCorners={true}
            >
              {PAGE_ORDER.map((panelId) => (
                <Page
                  key={panelId}
                  thumbnail={zine.panels[panelId].thumbnail}
                  label={zine.panels[panelId].label}
                />
              ))}
            </HTMLFlipBook>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="px-6 py-2 rounded-lg bg-white/80 hover:bg-white text-[var(--color-mauve)] font-medium shadow-sm transition-all duration-150 hover:shadow-md"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-white/80 hover:bg-white text-[var(--color-mauve)] font-medium shadow-sm transition-all duration-150 hover:shadow-md"
            >
              Next
            </button>
          </div>

          <p className="text-sm text-[var(--color-mauve)]/60 text-center">
            Click the corners or drag to flip pages
          </p>
        </motion.div>
      </main>
    </div>
  );
}
