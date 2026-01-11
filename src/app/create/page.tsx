"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/editor/Header";
import ZineGrid from "@/components/editor/ZineGrid";
import LabelToggle from "@/components/editor/LabelToggle";
import { useZineStorage } from "@/hooks/useZineStorage";
import { PanelPosition } from "@/types/zine";
import { generateZinePDF } from "@/lib/generatePDF";
import { copyShareURL } from "@/lib/shareZine";

export default function CreatePage() {
  const router = useRouter();
  const { zine, isLoading, toggleLabels, resetZine } = useZineStorage();

  const handlePanelClick = (panelId: PanelPosition) => {
    router.push(`/create/${panelId}`);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handlePreview = () => {
    router.push("/preview");
  };

  const handleDownload = async () => {
    if (!zine || isDownloading) return;
    setIsDownloading(true);
    try {
      await generateZinePDF(zine);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleShare = async () => {
    if (!zine) return;
    const success = await copyShareURL(zine);
    if (success) {
      setShareMessage("Link copied to clipboard!");
      setTimeout(() => setShareMessage(null), 3000);
    } else {
      setShareMessage("Failed to copy link");
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  if (isLoading || !zine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex flex-col">
      <Header onPreview={handlePreview} onDownload={handleDownload} onShare={handleShare} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-luckiest-guy)] text-2xl md:text-3xl text-[var(--color-mauve-dark)] mb-8 text-center"
        >
          PICK A FRAME TO WORK ON!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <ZineGrid zine={zine} onPanelClick={handlePanelClick} />
        </motion.div>
      </main>

      <LabelToggle showLabels={zine.showLabels} onToggle={toggleLabels} onClearAll={resetZine} />

      {/* Share toast message */}
      {shareMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--color-mauve-dark)] text-white rounded-lg shadow-lg text-sm font-medium"
        >
          {shareMessage}
        </motion.div>
      )}
    </div>
  );
}
