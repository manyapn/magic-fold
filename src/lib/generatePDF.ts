import { jsPDF } from "jspdf";
import * as fabric from "fabric";
import { ZineState, PanelPosition } from "@/types/zine";

// PDF dimensions in inches (landscape 8.5 x 11)
const PAGE_WIDTH = 11;
const PAGE_HEIGHT = 8.5;
const MARGIN = 0.25;

// Panel layout: 4 columns, 2 rows
const COLS = 4;
const ROWS = 2;

// Calculate panel dimensions maintaining 3:4 aspect ratio
const AVAILABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;
const AVAILABLE_HEIGHT = PAGE_HEIGHT - MARGIN * 2;

const PANEL_WIDTH = AVAILABLE_WIDTH / COLS;
const PANEL_HEIGHT = PANEL_WIDTH / 0.75; // 3:4 ratio means width/height = 0.75

// If panels are too tall, constrain by height instead
const FINAL_PANEL_HEIGHT = Math.min(PANEL_HEIGHT, AVAILABLE_HEIGHT / ROWS);
const FINAL_PANEL_WIDTH = FINAL_PANEL_HEIGHT * 0.75;

// For 300 DPI print quality
const DPI = 300;
const RENDER_WIDTH = Math.round(FINAL_PANEL_WIDTH * DPI);
const RENDER_HEIGHT = Math.round(FINAL_PANEL_HEIGHT * DPI);


const TOP_ROW: PanelPosition[] = ["four", "three", "two", "one"];
const BOTTOM_ROW: PanelPosition[] = ["five", "six", "back", "front"];

/**
 * Renders a panel's canvasJSON to a high-resolution data URL
 */
async function renderPanelToImage(
  canvasJSON: string | null,
  rotate180: boolean
): Promise<string> {
  return new Promise((resolve) => {
    if (!canvasJSON) {
      // Empty panel - create white image
      const canvas = document.createElement("canvas");
      canvas.width = RENDER_WIDTH;
      canvas.height = RENDER_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
      }
      resolve(canvas.toDataURL("image/png", 1.0));
      return;
    }

    try {
      const parsed = JSON.parse(canvasJSON);
      const originalWidth = parsed.width || 450;
      const originalHeight = parsed.height || 600;

      // Create canvas at original size first
      const canvasEl = document.createElement("canvas");
      canvasEl.width = originalWidth;
      canvasEl.height = originalHeight;

      const fabricCanvas = new fabric.StaticCanvas(canvasEl, {
        width: originalWidth,
        height: originalHeight,
        backgroundColor: "#ffffff",
      });

      fabricCanvas.loadFromJSON(parsed).then(() => {
        fabricCanvas.backgroundColor = "#ffffff";
        fabricCanvas.renderAll();

        // Export at high resolution using multiplier
        const scaleX = RENDER_WIDTH / originalWidth;
        const scaleY = RENDER_HEIGHT / originalHeight;
        const multiplier = Math.min(scaleX, scaleY);

        const highResDataUrl = fabricCanvas.toDataURL({
          format: "png",
          quality: 1.0,
          multiplier: multiplier,
        });

        if (rotate180) {
          // Load the image and rotate it
          const img = new Image();
          img.onload = () => {
            const rotatedCanvas = document.createElement("canvas");
            rotatedCanvas.width = img.width;
            rotatedCanvas.height = img.height;
            const ctx = rotatedCanvas.getContext("2d");
            if (ctx) {
              ctx.translate(img.width, img.height);
              ctx.rotate(Math.PI);
              ctx.drawImage(img, 0, 0);
            }
            resolve(rotatedCanvas.toDataURL("image/png", 1.0));
          };
          img.src = highResDataUrl;
          img.onerror = () => resolve(highResDataUrl);
        } else {
          resolve(highResDataUrl);
        }
      });
    } catch (e) {
      console.error("Failed to parse canvas JSON:", e);
      // Return white image on error
      const canvas = document.createElement("canvas");
      canvas.width = RENDER_WIDTH;
      canvas.height = RENDER_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
      }
      resolve(canvas.toDataURL("image/png", 1.0));
    }
  });
}

/**
 * Generates a print-ready PDF from the zine
 */
export async function generateZinePDF(zine: ZineState): Promise<void> {
  // Create PDF in landscape orientation
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: "letter",
  });

  // Calculate starting position to center the grid
  const totalWidth = FINAL_PANEL_WIDTH * COLS;
  const totalHeight = FINAL_PANEL_HEIGHT * ROWS;
  const startX = (PAGE_WIDTH - totalWidth) / 2;
  const startY = (PAGE_HEIGHT - totalHeight) / 2;

  // Render top row (upside down panels)
  for (let col = 0; col < COLS; col++) {
    const panelId = TOP_ROW[col];
    const panel = zine.panels[panelId];
    const imageData = await renderPanelToImage(panel.canvasJSON, true);

    const x = startX + col * FINAL_PANEL_WIDTH;
    const y = startY;

    pdf.addImage(imageData, "PNG", x, y, FINAL_PANEL_WIDTH, FINAL_PANEL_HEIGHT);
  }

  // Render bottom row (right-side up panels)
  for (let col = 0; col < COLS; col++) {
    const panelId = BOTTOM_ROW[col];
    const panel = zine.panels[panelId];
    const imageData = await renderPanelToImage(panel.canvasJSON, false);

    const x = startX + col * FINAL_PANEL_WIDTH;
    const y = startY + FINAL_PANEL_HEIGHT;

    pdf.addImage(imageData, "PNG", x, y, FINAL_PANEL_WIDTH, FINAL_PANEL_HEIGHT);
  }

  // Draw dashed cut lines
  pdf.setDrawColor(150, 150, 150); // Gray color
  pdf.setLineWidth(0.01); // Thin line
  pdf.setLineDashPattern([0.1, 0.05], 0); // Dashed pattern

  // Horizontal line (between rows)
  const horizontalY = startY + FINAL_PANEL_HEIGHT;
  pdf.line(startX, horizontalY, startX + totalWidth, horizontalY);

  // Vertical lines (between columns)
  for (let col = 1; col < COLS; col++) {
    const verticalX = startX + col * FINAL_PANEL_WIDTH;
    pdf.line(verticalX, startY, verticalX, startY + totalHeight);
  }

  // Outer border (optional - shows the full cut area)
  pdf.rect(startX, startY, totalWidth, totalHeight);

  // Download the PDF
  pdf.save("magic-fold-zine.pdf");
}
