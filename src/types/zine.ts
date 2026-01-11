// Panel position in the 8-panel zine grid
export type PanelPosition =
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "back"
  | "front";

// Panel data - stores the canvas state for each panel
export interface PanelData {
  id: PanelPosition;
  label: string;
  canvasJSON: string | null; // Fabric.js serialized canvas state
  thumbnail: string | null; // Base64 data URL of canvas preview
  isUpsideDown: boolean; // Top row panels are displayed upside down
}

// Full zine state
export interface ZineState {
  id: string;
  panels: Record<PanelPosition, PanelData>;
  showLabels: boolean;
  createdAt: string;
  updatedAt: string;
}

// Panel layout configuration
// Top row is FOUR-THREE-TWO-ONE (reversed, displayed upside down)
// Bottom row is FIVE-SIX-BACK-FRONT
export const PANEL_CONFIG: Record<
  PanelPosition,
  { label: string; row: "top" | "bottom"; order: number }
> = {
  four: { label: "FOUR", row: "top", order: 0 },
  three: { label: "THREE", row: "top", order: 1 },
  two: { label: "TWO", row: "top", order: 2 },
  one: { label: "ONE", row: "top", order: 3 },
  five: { label: "FIVE", row: "bottom", order: 0 },
  six: { label: "SIX", row: "bottom", order: 1 },
  back: { label: "BACK", row: "bottom", order: 2 },
  front: { label: "FRONT", row: "bottom", order: 3 },
};

// Create initial empty zine state
export function createEmptyZine(): ZineState {
  const now = new Date().toISOString();
  const panels = Object.entries(PANEL_CONFIG).reduce(
    (acc, [id, config]) => {
      acc[id as PanelPosition] = {
        id: id as PanelPosition,
        label: config.label,
        canvasJSON: null,
        thumbnail: null,
        isUpsideDown: config.row === "top",
      };
      return acc;
    },
    {} as Record<PanelPosition, PanelData>
  );

  return {
    id: crypto.randomUUID(),
    panels,
    showLabels: true,
    createdAt: now,
    updatedAt: now,
  };
}
