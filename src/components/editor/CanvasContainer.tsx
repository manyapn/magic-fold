"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import * as fabric from "fabric";
import { EditorTool, FontFamily, FONT_OPTIONS } from "@/types/editor";

export interface CanvasContainerRef {
  saveToGrid: () => void;
  clear: () => void;
}

interface CanvasContainerProps {
  activeTool: EditorTool;
  brushColor: string;
  brushSize: number;
  eraserSize: number;
  selectedFont: FontFamily;
  fontSize: number;
  initialCanvasJSON?: string | null;
  onAutoSave?: (canvasJSON: string) => void;
  onSaveToGrid?: (canvasJSON: string, thumbnail: string) => void;
  onCanvasReady?: () => void;
}

// Aspect ratio 3:4 (width:height) for panel
const ASPECT_RATIO = 3 / 4;

const CanvasContainer = forwardRef<CanvasContainerRef, CanvasContainerProps>(function CanvasContainer({
  activeTool,
  brushColor,
  brushSize,
  eraserSize,
  selectedFont,
  fontSize,
  initialCanvasJSON,
  onAutoSave,
  onSaveToGrid,
  onCanvasReady,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const activeToolRef = useRef<EditorTool>(activeTool);
  const [dimensions, setDimensions] = useState({ width: 450, height: 600 });

  // Refs to always have latest callbacks (avoids stale closures)
  const onAutoSaveRef = useRef(onAutoSave);
  const onSaveToGridRef = useRef(onSaveToGrid);

  // Keep refs in sync with props
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    onAutoSaveRef.current = onAutoSave;
  }, [onAutoSave]);

  useEffect(() => {
    onSaveToGridRef.current = onSaveToGrid;
  }, [onSaveToGrid]);

  // Helper to set selectability based on text mode
  const applyTextModeSelectability = (canvas: fabric.Canvas) => {
    canvas.getObjects().forEach((obj) => {
      if (obj instanceof fabric.IText) {
        // Always make IText objects selectable and evented
        obj.selectable = true;
        obj.evented = true;
      } else if (activeToolRef.current === "text") {
        // In text mode, make non-text objects non-selectable
        obj.selectable = false;
        obj.evented = false;
      }
    });
  };

  // Calculate size based on viewport
  useEffect(() => {
    const calculateSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const availableHeight = viewportHeight - 120;
      const availableWidth = viewportWidth - 280;

      let height = Math.min(availableHeight * 0.85, 700);
      let width = height * ASPECT_RATIO;

      if (width > availableWidth * 0.9) {
        width = availableWidth * 0.9;
        height = width / ASPECT_RATIO;
      }

      height = Math.max(height, 400);
      width = Math.max(width, 300);

      setDimensions({
        width: Math.floor(width),
        height: Math.floor(height),
      });
    };

    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, []);

  // Initialize Fabric.js canvas ONCE on mount
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: "#ffffff",
    });

    fabricCanvasRef.current = canvas;

    // Render immediately to show white background
    canvas.renderAll();

    // Load initial data if provided
    if (initialCanvasJSON) {
      try {
        canvas.loadFromJSON(JSON.parse(initialCanvasJSON)).then(() => {
          // Ensure white background after loading
          canvas.backgroundColor = "#ffffff";
          applyTextModeSelectability(canvas);
          canvas.renderAll();
        });
      } catch (e) {
        console.error("Failed to load canvas:", e);
      }
    }

    // Debounced auto-save to storage (JSON only, no thumbnail)
    let saveTimeout: NodeJS.Timeout | null = null;
    const debouncedAutoSave = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const json = JSON.stringify(canvas.toJSON());
        onAutoSaveRef.current?.(json);
      }, 300); // 300ms debounce
    };

    // Auto-save on changes
    canvas.on("object:added", debouncedAutoSave);
    canvas.on("object:modified", debouncedAutoSave);
    canvas.on("text:editing:exited", debouncedAutoSave);

    onCanvasReady?.();

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      // Final auto-save before unmount (JSON only)
      const json = JSON.stringify(canvas.toJSON());
      onAutoSaveRef.current?.(json);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Helper to generate thumbnail from canvas
  const generateThumbnail = (canvas: fabric.Canvas): string => {
    return canvas.toDataURL({
      format: "png",
      quality: 0.8,
      multiplier: 0.3,
    });
  };

  // Expose saveToGrid and clear methods via ref
  useImperativeHandle(ref, () => ({
    saveToGrid: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const json = JSON.stringify(canvas.toJSON());
      const thumbnail = generateThumbnail(canvas);
      onSaveToGridRef.current?.(json, thumbnail);
    },
    clear: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      try {
        // Clear internal objects array directly
        canvas.discardActiveObject();
        canvas._objects.length = 0;

        // Get the lower canvas element directly and clear it
        const lowerCanvas = canvas.lowerCanvasEl;
        if (lowerCanvas) {
          const ctx = lowerCanvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, lowerCanvas.width, lowerCanvas.height);
          }
        }

        // Trigger auto-save with empty canvas
        const json = JSON.stringify(canvas.toJSON());
        onAutoSaveRef.current?.(json);
      } catch (e) {
        console.error("Clear failed:", e);
      }
    },
  }), []);

  // Update brush when tool/color/size changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Helper to set selectability of objects based on mode
    const setObjectSelectability = (textMode: boolean) => {
      canvas.getObjects().forEach((obj) => {
        if (obj instanceof fabric.IText) {
          // IText objects are always selectable
          obj.selectable = true;
          obj.evented = true;
        } else {
          // Non-text objects only selectable when not in text mode
          obj.selectable = !textMode;
          obj.evented = !textMode;
        }
      });
    };

    // Handler to make newly added non-text objects non-selectable in text mode
    const handleObjectAdded = (e: { target: fabric.FabricObject }) => {
      if (activeTool === "text" && e.target && !(e.target instanceof fabric.IText)) {
        e.target.selectable = false;
        e.target.evented = false;
      }
    };

    if (activeTool === "pencil") {
      canvas.isDrawingMode = true;
      canvas.selection = true;
      setObjectSelectability(false);
      const brush = new fabric.PencilBrush(canvas);
      brush.color = brushColor;
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;
    } else if (activeTool === "eraser") {
      canvas.isDrawingMode = true;
      canvas.selection = true;
      setObjectSelectability(false);
      const brush = new fabric.PencilBrush(canvas);
      brush.color = "#ffffff";
      brush.width = eraserSize;
      canvas.freeDrawingBrush = brush;
    } else if (activeTool === "text") {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      // Make only text objects selectable
      setObjectSelectability(true);
      // Deselect any non-text objects
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    // Listen for new objects to apply selectability rules
    canvas.on("object:added", handleObjectAdded);

    return () => {
      canvas.off("object:added", handleObjectAdded);
    };
  }, [activeTool, brushColor, brushSize, eraserSize]);

  // Handle text tool clicks via Fabric's mouse:down:before event (fires before Fabric processes)
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let hadActiveText = false;

    const handleBeforeMouseDown = () => {
      if (activeTool !== "text") return;
      // Track if there was an active text before the click
      const activeObject = canvas.getActiveObject();
      hadActiveText = !!(activeObject && activeObject instanceof fabric.IText);
    };

    const handleMouseDown = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
      if (activeTool !== "text") return;

      const target = canvas.findTarget(opt.e);

      // If clicking on an IText, let Fabric handle selection/editing naturally
      if (target && target instanceof fabric.IText) {
        return;
      }

      // If there was an active text before this click, just deselect (don't create new)
      if (hadActiveText) {
        hadActiveText = false;
        return;
      }

      // Create new text only if clicking on empty area with no prior text selected
      const pointer = canvas.getScenePoint(opt.e);

      const fontOption = FONT_OPTIONS.find((f) => f.id === selectedFont);
      const fontFamily = fontOption?.name || "Inter";

      const text = new fabric.IText("Type here", {
        left: pointer.x,
        top: pointer.y,
        fontSize: fontSize,
        fontFamily,
        fill: brushColor,
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
    };

    canvas.on("mouse:down:before", handleBeforeMouseDown);
    canvas.on("mouse:down", handleMouseDown);

    return () => {
      canvas.off("mouse:down:before", handleBeforeMouseDown);
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [activeTool, selectedFont, fontSize, brushColor]);

  // Handle backspace to delete selected text when not editing
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool !== "text") return;
      if (e.key !== "Backspace" && e.key !== "Delete") return;

      const activeObject = canvas.getActiveObject();
      if (!activeObject || !(activeObject instanceof fabric.IText)) return;

      // Only delete if not in editing mode
      if (activeObject.isEditing) return;

      canvas.remove(activeObject);
      canvas.renderAll();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTool]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="shadow-lg"
        style={{ touchAction: "none" }}
      />
    </div>
  );
});

export default CanvasContainer;
