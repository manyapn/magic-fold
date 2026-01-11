"use client";

import { use, useCallback, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PANEL_CONFIG, PanelPosition } from "@/types/zine";
import { useZineStorage } from "@/hooks/useZineStorage";
import { EditorTool, FontFamily, DEFAULT_EDITOR_STATE } from "@/types/editor";
import Toolbar from "@/components/editor/Toolbar";
import CanvasContainer, { CanvasContainerRef } from "@/components/editor/CanvasContainer";
import SideControls from "@/components/editor/SideControls";

interface PageProps {
  params: Promise<{ panelId: string }>;
}

// Panel navigation order
const PANEL_ORDER: PanelPosition[] = ["four", "three", "two", "one", "five", "six", "back", "front"];

export default function PanelEditorPage({ params }: PageProps) {
  const { panelId } = use(params);
  const router = useRouter();
  const panelConfig = PANEL_CONFIG[panelId as PanelPosition];
  const canvasRef = useRef<CanvasContainerRef>(null);

  const { zine, isLoading, autoSavePanel, savePanelToGrid } = useZineStorage();

  // Editor state - managed here, passed to CanvasContainer
  const [editorState, setEditorState] = useState(DEFAULT_EDITOR_STATE);
  const [isReady, setIsReady] = useState(false);

  // Get initial canvas data for this panel
  const initialCanvasJSON = useMemo(() => {
    if (!zine) return null;
    return zine.panels[panelId as PanelPosition]?.canvasJSON || null;
  }, [zine, panelId]);

  // Auto-save (JSON only, for recovery)
  const handleAutoSave = useCallback(
    (canvasJSON: string) => {
      autoSavePanel(panelId, canvasJSON);
    },
    [panelId, autoSavePanel]
  );

  // Save to grid (with thumbnail)
  const handleSaveToGrid = useCallback(
    (canvasJSON: string, thumbnail: string) => {
      savePanelToGrid(panelId, canvasJSON, thumbnail);
    },
    [panelId, savePanelToGrid]
  );

  // Manual save button handler
  const handleSaveClick = useCallback(() => {
    canvasRef.current?.saveToGrid();
  }, []);

  // Clear canvas handler
  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  // Tool handlers
  const setActiveTool = useCallback((tool: EditorTool) => {
    setEditorState((prev) => ({ ...prev, activeTool: tool }));
  }, []);

  const setBrushSize = useCallback((size: number) => {
    setEditorState((prev) => ({ ...prev, brushSize: size }));
  }, []);

  const setEraserSize = useCallback((size: number) => {
    setEditorState((prev) => ({ ...prev, eraserSize: size }));
  }, []);

  const setBrushColor = useCallback((color: string) => {
    setEditorState((prev) => ({ ...prev, brushColor: color }));
  }, []);

  const setSelectedFont = useCallback((font: FontFamily) => {
    setEditorState((prev) => ({ ...prev, selectedFont: font }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setEditorState((prev) => ({ ...prev, fontSize: size }));
  }, []);

  // Panel navigation
  const currentIndex = PANEL_ORDER.indexOf(panelId as PanelPosition);

  const handlePrevPanel = useCallback(() => {
    const prevIndex = (currentIndex - 1 + PANEL_ORDER.length) % PANEL_ORDER.length;
    router.push(`/create/${PANEL_ORDER[prevIndex]}`);
  }, [currentIndex, router]);

  const handleNextPanel = useCallback(() => {
    const nextIndex = (currentIndex + 1) % PANEL_ORDER.length;
    router.push(`/create/${PANEL_ORDER[nextIndex]}`);
  }, [currentIndex, router]);

  if (!panelConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-[var(--color-mauve-dark)] mb-4">Panel not found</h1>
          <Link href="/create" className="text-[var(--color-mauve)] hover:underline">
            Back to editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
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
          ← BACK
        </Link>
      </header>

      {/* Main editor area */}
      <main className="flex-1 flex px-6 pb-6 gap-4">
        {/* Left toolbar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <Toolbar
            activeTool={editorState.activeTool}
            onToolChange={setActiveTool}
            brushSize={editorState.brushSize}
            onBrushSizeChange={setBrushSize}
            eraserSize={editorState.eraserSize}
            onEraserSizeChange={setEraserSize}
            brushColor={editorState.brushColor}
            onColorChange={setBrushColor}
            selectedFont={editorState.selectedFont}
            onFontChange={setSelectedFont}
            fontSize={editorState.fontSize}
            onFontSizeChange={setFontSize}
          />
        </motion.div>

        {/* Canvas area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 flex items-center justify-center"
        >
          {!isLoading && (
            <CanvasContainer
              key={panelId}
              ref={canvasRef}
              activeTool={editorState.activeTool}
              brushColor={editorState.brushColor}
              brushSize={editorState.brushSize}
              eraserSize={editorState.eraserSize}
              selectedFont={editorState.selectedFont}
              fontSize={editorState.fontSize}
              initialCanvasJSON={initialCanvasJSON}
              onAutoSave={handleAutoSave}
              onSaveToGrid={handleSaveToGrid}
              onCanvasReady={() => setIsReady(true)}
            />
          )}
        </motion.div>

        {/* Right side controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 flex items-center"
        >
          <SideControls
            onPrevPanel={handlePrevPanel}
            onNextPanel={handleNextPanel}
            onSave={handleSaveClick}
            onClear={handleClear}
            currentPanelLabel={panelConfig.label}
          />
        </motion.div>
      </main>

      {/* Loading overlay */}
      {(isLoading || !isReady) && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="text-[var(--color-mauve)] text-lg">Loading canvas...</div>
        </div>
      )}
    </div>
  );
}
