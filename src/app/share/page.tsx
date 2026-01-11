"use client";

import { useRef, useEffect, useState, forwardRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import * as fabric from "fabric";
import { PanelPosition } from "@/types/zine";
import { decompressSharedZine } from "@/lib/shareZine";

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
const Page = forwardRef<HTMLDivElement, { imageUrl: string | null; label: string }>(
  function Page({ imageUrl, label }, ref) {
    return (
      <div
        ref={ref}
        className="bg-white shadow-md flex items-center justify-center overflow-hidden relative"
        style={{ width: "100%", height: "100%" }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${label} page`}
            className="w-full h-full object-cover"
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

// Render canvasJSON to image URL
async function renderCanvasToImage(canvasJSON: string | null): Promise<string | null> {
  if (!canvasJSON) return null;

  return new Promise((resolve) => {
    try {
      const parsed = JSON.parse(canvasJSON);
      const width = parsed.width || 450;
      const height = parsed.height || 600;

      const canvasEl = document.createElement("canvas");
      canvasEl.width = width;
      canvasEl.height = height;

      const fabricCanvas = new fabric.StaticCanvas(canvasEl, {
        width,
        height,
        backgroundColor: "#ffffff",
      });

      fabricCanvas.loadFromJSON(parsed).then(() => {
        fabricCanvas.backgroundColor = "#ffffff";
        fabricCanvas.renderAll();
        resolve(fabricCanvas.toDataURL({ format: "png", quality: 1.0, multiplier: 1 }));
      });
    } catch (e) {
      console.error("Failed to render canvas:", e);
      resolve(null);
    }
  });
}

function SharePageContent() {
  const searchParams = useSearchParams();
  const bookRef = useRef<any>(null);
  const [panelImages, setPanelImages] = useState<Record<PanelPosition, string | null>>({
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
    front: null,
    back: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedZine = async () => {
      const data = searchParams.get("data");
      if (!data) {
        setError("No zine data found in URL");
        setIsLoading(false);
        return;
      }

      const sharedZine = decompressSharedZine(data);
      if (!sharedZine) {
        setError("Failed to load zine data");
        setIsLoading(false);
        return;
      }

      // Render each panel to an image
      const images: Record<PanelPosition, string | null> = {
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        front: null,
        back: null,
      };

      for (const panelId of PAGE_ORDER) {
        images[panelId] = await renderCanvasToImage(sharedZine.panels[panelId]);
      }

      setPanelImages(images);
      setIsLoading(false);
    };

    loadSharedZine();
  }, [searchParams]);

  const handlePrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[var(--color-mauve)] text-lg"
        >
          Loading zine...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-cream)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl text-[var(--color-mauve-dark)] mb-4">{error}</h1>
          <Link
            href="/"
            className="text-[var(--color-mauve)] hover:underline"
          >
            Create your own zine
          </Link>
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
          CREATE YOUR OWN
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
          CHECK OUT THIS ZINE
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
                  imageUrl={panelImages[panelId]}
                  label={panelId.toUpperCase()}
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

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
          <div className="text-[var(--color-mauve)] text-lg">Loading...</div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
