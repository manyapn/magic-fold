"use client";

import { useState } from "react";
import { EditorTool, FontFamily } from "@/types/editor";
import ToolButton from "./ToolButton";
import BrushSizeSlider from "./BrushSizeSlider";
import ColorPicker from "./ColorPicker";
import FontSelector from "./FontSelector";

// Icons
const PencilIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const EraserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
    <path d="M22 21H7" />
    <path d="m5 11 9 9" />
  </svg>
);

const TextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="4" y="18" fontSize="16" fontWeight="bold" fill="currentColor" stroke="none">Aa</text>
  </svg>
);

interface ToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  eraserSize: number;
  onEraserSizeChange: (size: number) => void;
  brushColor: string;
  onColorChange: (color: string) => void;
  selectedFont: FontFamily;
  onFontChange: (font: FontFamily) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export default function Toolbar({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  eraserSize,
  onEraserSizeChange,
  brushColor,
  onColorChange,
  selectedFont,
  onFontChange,
  fontSize,
  onFontSizeChange,
}: ToolbarProps) {
  // Track which tool's options panel is visible
  const [showOptions, setShowOptions] = useState<EditorTool | null>("pencil");

  const handleToolClick = (tool: EditorTool) => {
    if (activeTool === tool) {
      // Already active - toggle options visibility
      setShowOptions(showOptions === tool ? null : tool);
    } else {
      // Switch to new tool and show its options
      onToolChange(tool);
      setShowOptions(tool);
    }
  };

  const handleToolDoubleClick = (tool: EditorTool) => {
    // Double-click hides options
    if (activeTool === tool) {
      setShowOptions(null);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      {/* Pencil tool */}
      <div className="flex items-start gap-2">
        <ToolButton
          icon={<PencilIcon />}
          isActive={activeTool === "pencil"}
          onClick={() => handleToolClick("pencil")}
          onDoubleClick={() => handleToolDoubleClick("pencil")}
          label="Pencil tool (double-click to hide options)"
        />
        {activeTool === "pencil" && showOptions === "pencil" && (
          <BrushSizeSlider value={brushSize} onChange={onBrushSizeChange} max={100} />
        )}
      </div>

      {/* Eraser tool */}
      <div className="flex items-start gap-2">
        <ToolButton
          icon={<EraserIcon />}
          isActive={activeTool === "eraser"}
          onClick={() => handleToolClick("eraser")}
          onDoubleClick={() => handleToolDoubleClick("eraser")}
          label="Eraser tool (double-click to hide options)"
        />
        {activeTool === "eraser" && showOptions === "eraser" && (
          <BrushSizeSlider value={eraserSize} onChange={onEraserSizeChange} min={5} max={100} />
        )}
      </div>

      {/* Text tool */}
      <div className="flex items-start gap-2">
        <ToolButton
          icon={<TextIcon />}
          isActive={activeTool === "text"}
          onClick={() => handleToolClick("text")}
          onDoubleClick={() => handleToolDoubleClick("text")}
          label="Text tool (double-click to hide options)"
        />
        {activeTool === "text" && showOptions === "text" && (
          <FontSelector
            value={selectedFont}
            onChange={onFontChange}
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
          />
        )}
      </div>

      {/* Color picker - always visible */}
      <ColorPicker value={brushColor} onChange={onColorChange} />
    </div>
  );
}
