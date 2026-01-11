"use client";

import { useState, useEffect, useCallback } from "react";
import { ZineState, createEmptyZine } from "@/types/zine";

const STORAGE_KEY = "magic-fold-zine";

export function useZineStorage() {
  const [zine, setZine] = useState<ZineState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load zine from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setZine(JSON.parse(stored));
      } else {
        // Create new zine if none exists
        const newZine = createEmptyZine();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newZine));
        setZine(newZine);
      }
    } catch (error) {
      console.error("Failed to load zine from storage:", error);
      const newZine = createEmptyZine();
      setZine(newZine);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save zine to localStorage whenever it changes
  const saveZine = useCallback((updatedZine: ZineState) => {
    const withTimestamp = {
      ...updatedZine,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTimestamp));
    setZine(withTimestamp);
  }, []);

  // Toggle label visibility
  const toggleLabels = useCallback(() => {
    if (!zine) return;
    saveZine({ ...zine, showLabels: !zine.showLabels });
  }, [zine, saveZine]);

  // Auto-save panel canvas data (no thumbnail, for recovery)
  const autoSavePanel = useCallback(
    (panelId: string, canvasJSON: string) => {
      if (!zine) return;
      saveZine({
        ...zine,
        panels: {
          ...zine.panels,
          [panelId]: {
            ...zine.panels[panelId as keyof typeof zine.panels],
            canvasJSON,
          },
        },
      });
    },
    [zine, saveZine]
  );

  // Save panel with thumbnail (for grid display)
  const savePanelToGrid = useCallback(
    (panelId: string, canvasJSON: string, thumbnail: string) => {
      if (!zine) return;
      saveZine({
        ...zine,
        panels: {
          ...zine.panels,
          [panelId]: {
            ...zine.panels[panelId as keyof typeof zine.panels],
            canvasJSON,
            thumbnail,
          },
        },
      });
    },
    [zine, saveZine]
  );

  // Clear a specific panel
  const clearPanel = useCallback(
    (panelId: string) => {
      if (!zine) return;
      saveZine({
        ...zine,
        panels: {
          ...zine.panels,
          [panelId]: {
            ...zine.panels[panelId as keyof typeof zine.panels],
            canvasJSON: null,
          },
        },
      });
    },
    [zine, saveZine]
  );

  // Reset entire zine
  const resetZine = useCallback(() => {
    const newZine = createEmptyZine();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newZine));
    setZine(newZine);
  }, []);

  return {
    zine,
    isLoading,
    saveZine,
    toggleLabels,
    autoSavePanel,
    savePanelToGrid,
    clearPanel,
    resetZine,
  };
}
