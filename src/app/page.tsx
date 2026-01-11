"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ZineInfoModal from "@/components/editor/ZineInfoModal";

export default function LandingPage() {
  const [showZineInfo, setShowZineInfo] = useState(false);

  return (
    <>
      <main className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-4xl  px-12 py-16 max-w-xl w-full text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-(family-name:--font-luckiest-guy) text-4xl md:text-5xl text-(--color-text-title) mb-2 tracking-wide"
          >
            MAGIC FOLD
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-(--color-text-subtitle) text-sm md:text-base font-black tracking-widest uppercase mb-6"
          >
            A Digital Zine Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button onClick={() => setShowZineInfo(true)}>What Is A Zine?</Button>
            <Link href="/create">
              <Button>Make Your Zine!</Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <ZineInfoModal isOpen={showZineInfo} onClose={() => setShowZineInfo(false)} />
    </>
  );
}
