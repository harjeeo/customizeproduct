import mugMockup from "./mug-mockup.svg";
import previewFront from "./preview-front.jpg";

// A mug's print wraps around the cylinder, so the editor shows the
// flattened/unrolled print area — a wide rectangle — rather than a product
// silhouette. viewBox is cropped to just that strip (with a little margin)
// so the editor doesn't waste vertical space on empty canvas.
export const mug = {
  id: "mug",
  name: "Mug",
  canvas: { width: 1000, height: 480 },
  sides: [
    {
      id: "wrap",
      label: "Wrap",
      mockup: mugMockup,
      printArea: {
        xPct: 9.002,
        yPct: 14.529,
        widthPct: 81.995,
        heightPct: 70.942,
        widthIn: 8.5,
        heightIn: 3.53,
      },
      // Flat front-on photo used by the regular (non-3D) Preview tab —
      // approximates the label as a flat rectangle on the visible front face.
      previewMockup: previewFront,
      previewPrintArea: {
        xPct: 35.0,
        yPct: 38.0,
        widthPct: 36.0,
        heightPct: 26.0,
      },
      // Marks this product as eligible for the rotating Three.js 3D Preview
      // (see PreviewView3D) — the print wraps this fraction of the mug's
      // circumference, starting at this angle (handle sits in the gap).
      threeD: {
        type: "mug",
        wrapStartFraction: 0.09002,
        wrapFraction: 0.81995,
      },
    },
  ],
};
