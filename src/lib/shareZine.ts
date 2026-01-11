import LZString from "lz-string";
import { ZineState, PanelPosition } from "@/types/zine";

// Minimal zine data for sharing (just canvasJSON, no thumbnails)
interface SharedZineData {
  panels: Record<PanelPosition, string | null>;
}

/**
 * Compresses zine data into a URL-safe string
 */
export function compressZineForShare(zine: ZineState): string {
  // Extract only the canvasJSON from each panel (no thumbnails to save space)
  const sharedData: SharedZineData = {
    panels: {
      one: zine.panels.one.canvasJSON,
      two: zine.panels.two.canvasJSON,
      three: zine.panels.three.canvasJSON,
      four: zine.panels.four.canvasJSON,
      five: zine.panels.five.canvasJSON,
      six: zine.panels.six.canvasJSON,
      front: zine.panels.front.canvasJSON,
      back: zine.panels.back.canvasJSON,
    },
  };

  const jsonString = JSON.stringify(sharedData);
  const compressed = LZString.compressToEncodedURIComponent(jsonString);
  return compressed;
}

/**
 * Decompresses shared zine data from URL string
 */
export function decompressSharedZine(compressed: string): SharedZineData | null {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as SharedZineData;
  } catch (e) {
    console.error("Failed to decompress zine data:", e);
    return null;
  }
}

/**
 * Generates a share URL for the zine
 */
export function generateShareURL(zine: ZineState): string {
  const compressed = compressZineForShare(zine);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/share?data=${compressed}`;
}

/**
 * Copies the share URL to clipboard
 */
export async function copyShareURL(zine: ZineState): Promise<boolean> {
  try {
    const url = generateShareURL(zine);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (e) {
    console.error("Failed to copy to clipboard:", e);
    return false;
  }
}
