"use client";

import { ZineState, PanelPosition, PANEL_CONFIG } from "@/types/zine";
import Panel from "./Panel";

interface ZineGridProps {
  zine: ZineState;
  onPanelClick: (panelId: PanelPosition) => void;
}

export default function ZineGrid({ zine, onPanelClick }: ZineGridProps) {
  // Get panels sorted by row and order
  const topRowPanels = (
    Object.entries(PANEL_CONFIG) as [PanelPosition, (typeof PANEL_CONFIG)[PanelPosition]][]
  )
    .filter(([, config]) => config.row === "top")
    .sort((a, b) => a[1].order - b[1].order)
    .map(([id]) => zine.panels[id]);

  const bottomRowPanels = (
    Object.entries(PANEL_CONFIG) as [PanelPosition, (typeof PANEL_CONFIG)[PanelPosition]][]
  )
    .filter(([, config]) => config.row === "bottom")
    .sort((a, b) => a[1].order - b[1].order)
    .map(([id]) => zine.panels[id]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
      {/* Top row - panels displayed upside down */}
      <div className="grid grid-cols-4 gap-4">
        {topRowPanels.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            showLabel={zine.showLabels}
            onClick={() => onPanelClick(panel.id)}
          />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-4 gap-4">
        {bottomRowPanels.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            showLabel={zine.showLabels}
            onClick={() => onPanelClick(panel.id)}
          />
        ))}
      </div>
    </div>
  );
}
