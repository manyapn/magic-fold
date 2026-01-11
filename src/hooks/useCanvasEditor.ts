"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import * as fabric from "fabric";
import {
  EditorTool,
  EditorState,
  DEFAULT_EDITOR_STATE,
  FontFamily,
  FONT_OPTIONS,
} from "@/types/editor";

interface UseCanvasEditorProps {
  initialCanvasJSON?: string | null;
  onSave?: (canvasJSON: string) => void;
}

export function useCanvasEditor({ initialCanvasJSON, onSave }: UseCanvasEditorProps = {}) {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(DEFAULT_EDITOR_STATE);

  // Debounced save to storage
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (canvasRef.current && onSave) {
        onSave(JSON.stringify(canvasRef.current.toJSON()));
      }
    }, 500);
  }, [onSave]);

  // Initialize canvas
  const initCanvas = useCallback((canvasEl: HTMLCanvasElement, width: number, height: number) => {
    // Prevent re-initialization
    if (canvasRef.current) {
      return canvasRef.current;
    }

    console.log("Initializing Fabric.js canvas", { width, height });

    const canvas = new fabric.Canvas(canvasEl, {
      width,
      height,
      backgroundColor: "#FFFFFF",
      isDrawingMode: true,
    });

    // Set up pencil brush with default values
    const brush = new fabric.PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;
    canvas.freeDrawingBrush = brush;

    // Event listeners for history and saving
    canvas.on("path:created", debouncedSave);


    canvasRef.current = canvas;
    canvasElRef.current = canvasEl;

    // Load initial canvas data if provided
    if (initialCanvasJSON) {
      canvas.loadFromJSON(JSON.parse(initialCanvasJSON), () => {
        canvas.renderAll();
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }

    return canvas;
  }, [initialCanvasJSON, onSave]);

  // Resize canvas
  const resizeCanvas = useCallback((width: number, height: number) => {
    if (!canvasRef.current) return;

    canvasRef.current.setDimensions({ width, height });
    canvasRef.current.renderAll();
  }, []);

  // Set active tool
  const setActiveTool = useCallback((tool: EditorTool) => {
    setEditorState((prev) => {
      // Apply tool change to canvas
      if (canvasRef.current) {
        if (tool === "pencil") {
          canvasRef.current.isDrawingMode = true;
          const brush = new fabric.PencilBrush(canvasRef.current);
          brush.color = prev.brushColor;
          brush.width = prev.brushSize;
          canvasRef.current.freeDrawingBrush = brush;
        } else if (tool === "eraser") {
          canvasRef.current.isDrawingMode = true;
          const eraserBrush = new fabric.PencilBrush(canvasRef.current);
          eraserBrush.color = "#FFFFFF";
          eraserBrush.width = prev.eraserSize;
          canvasRef.current.freeDrawingBrush = eraserBrush;
        } else if (tool === "text") {
          canvasRef.current.isDrawingMode = false;
        }
      }
      return { ...prev, activeTool: tool };
    });
  }, []);

  // Set brush size
  const setBrushSize = useCallback((size: number) => {
    setEditorState((prev) => {
      if (canvasRef.current?.freeDrawingBrush && prev.activeTool === "pencil") {
        canvasRef.current.freeDrawingBrush.width = size;
      }
      return { ...prev, brushSize: size };
    });
  }, []);

  // Set eraser size
  const setEraserSize = useCallback((size: number) => {
    setEditorState((prev) => {
      if (canvasRef.current?.freeDrawingBrush && prev.activeTool === "eraser") {
        canvasRef.current.freeDrawingBrush.width = size;
      }
      return { ...prev, eraserSize: size };
    });
  }, []);

  // Set brush color
  const setBrushColor = useCallback((color: string) => {
    setEditorState((prev) => {
      if (canvasRef.current?.freeDrawingBrush && prev.activeTool === "pencil") {
        canvasRef.current.freeDrawingBrush.color = color;
      }
      return { ...prev, brushColor: color };
    });
  }, []);

  // Set font
  const setSelectedFont = useCallback((font: FontFamily) => {
    setEditorState((prev) => ({ ...prev, selectedFont: font }));
  }, []);

  // Set font size
  const setFontSize = useCallback((size: number) => {
    setEditorState((prev) => ({ ...prev, fontSize: size }));
  }, []);

  // Add text to canvas
  const addText = useCallback((x: number, y: number) => {
    if (!canvasRef.current) return;

    const fontOption = FONT_OPTIONS.find((f) => f.id === editorState.selectedFont);
    const fontFamily = fontOption?.name || "Inter";

    const text = new fabric.IText("Type here", {
      left: x,
      top: y,
      fontSize: editorState.fontSize,
      fontFamily,
      fill: editorState.brushColor,
      editable: true,
    });

    canvasRef.current.add(text);
    canvasRef.current.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
  }, [editorState.selectedFont, editorState.fontSize, editorState.brushColor]);

  // Handle canvas click for text tool
  const handleCanvasClick = useCallback((e: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
    if (editorState.activeTool === "text" && canvasRef.current) {
      const pointer = canvasRef.current.getScenePoint(e.e);
      // Only add text if clicking on empty space
      const target = canvasRef.current.findTarget(e.e);
      if (!target) {
        addText(pointer.x, pointer.y);
      }
    }
  }, [editorState.activeTool, addText]);

  // Set up click handler when tool changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Remove previous handler
    canvas.off("mouse:down");

    // Add click handler for text tool
    if (editorState.activeTool === "text") {
      canvas.on("mouse:down", handleCanvasClick);
    }

    return () => {
      canvas.off("mouse:down", handleCanvasClick);
    };
  }, [editorState.activeTool, handleCanvasClick]);


  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.clear();
    canvasRef.current.backgroundColor = "#FFFFFF";
    canvasRef.current.renderAll();
    debouncedSave();
  }, [debouncedSave]);

  // Get canvas JSON
  const getCanvasJSON = useCallback(() => {
    if (!canvasRef.current) return null;
    return JSON.stringify(canvasRef.current.toJSON());
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
    };
  }, []);

  return {
    canvasRef,
    isReady,
    editorState,
    initCanvas,
    resizeCanvas,
    setActiveTool,
    setBrushSize,
    setEraserSize,
    setBrushColor,
    setSelectedFont,
    setFontSize,
    addText,
    clearCanvas,
    getCanvasJSON,
  };
}
