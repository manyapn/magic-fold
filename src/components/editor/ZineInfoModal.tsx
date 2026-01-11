"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ZineInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ZineInfoModal({ isOpen, onClose }: ZineInfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-[80vh] overflow-y-auto p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <h2 className="font-(family-name:--font-luckiest-guy) text-2xl md:text-3xl text-mauve-dark mb-6">
                WHAT IS A ZINE?
              </h2>

              <div className="space-y-6 text-mauve-dark">
                <section>
                  <h3 className="font-bold text-lg mb-2">A Mini Magazine</h3>
                  <p className="text-sm leading-relaxed">
                    A zine (short for magazine or fanzine) is a small, self-published booklet.
                    They&apos;re a fun, creative way to share art, stories, poems, or anything you want!
                    The magic of an 8-panel zine is that it&apos;s made from a single sheet of paper
                    with just one cut and a few folds.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-2">Why the Editor Layout Looks Weird</h3>
                  <p className="text-sm leading-relaxed">
                    You might notice the top row is upside down! That&apos;s because in a physical zine, the paper is folded. When you print and fold the zine, everything will appear right-side up
                    in the correct reading order. The layout you see matches exactly how it will
                    look on the printed page before folding.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-lg mb-3">How to Fold Your Zine</h3>
                  <ol className="text-sm leading-relaxed space-y-3">
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">1</span>
                      <span>Print your downloaded PDF on a standard 8.5&quot; x 11&quot; paper (landscape orientation).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">2</span>
                      <span>Fold the paper in half horizontally (long edge to long edge), then unfold.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">3</span>
                      <span>Fold the paper in half vertically (short edge to short edge), then unfold.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">4</span>
                      <span>Fold in half vertically again (short edge to short edge), keeping it folded.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">5</span>
                      <span>Cut along the center horizontal crease, but ONLY the middle section (between the two vertical fold lines).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">6</span>
                      <span>Unfold completely, then fold in half horizontally again.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">7</span>
                      <span>Push the ends toward the center - the cut will open up and form your booklet!</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-mauve text-white flex items-center justify-center text-xs font-bold">8</span>
                      <span>Fold and crease to complete your zine. The front cover should be on top!</span>
                    </li>
                  </ol>
                </section>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    Tip: Practice with a blank sheet first to get the hang of it!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
