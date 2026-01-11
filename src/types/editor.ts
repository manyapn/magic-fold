export type EditorTool = "pencil" | "eraser" | "text";

export type FontFamily = "inter" | "playfair" | "dancing" | "caveat";

export interface FontOption {
  id: FontFamily;
  name: string;
  cssVar: string;
  category: "sans-serif" | "serif" | "cursive" | "handwriting";
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "inter", name: "Inter", cssVar: "var(--font-inter)", category: "sans-serif" },
  { id: "playfair", name: "Playfair", cssVar: "var(--font-playfair)", category: "serif" },
  { id: "dancing", name: "Dancing Script", cssVar: "var(--font-dancing)", category: "cursive" },
  { id: "caveat", name: "Caveat", cssVar: "var(--font-caveat)", category: "handwriting" },
];

export const COLOR_PALETTE = [
  "#000000", // Black
  "#FFFFFF", // White
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
];

export interface EditorState {
  activeTool: EditorTool;
  brushSize: number;
  eraserSize: number;
  brushColor: string;
  selectedFont: FontFamily;
  fontSize: number;
}

export const DEFAULT_EDITOR_STATE: EditorState = {
  activeTool: "pencil",
  brushSize: 5,
  eraserSize: 20,
  brushColor: "#000000",
  selectedFont: "inter",
  fontSize: 24,
};
