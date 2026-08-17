import mugMockup from "./mug-mockup.svg";
import previewFront from "./preview-front.jpg";
import previewLeft from "./preview-left.jpg";
import previewRight from "./preview-right.jpg";

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
      // Multiple flat photo angles for the (non-3D) Preview tab's mockup
      // switcher — each with its own print-area box on that specific photo.
      // The first entry doubles as the default previewMockup/previewPrintArea.
      previewMockups: [
        {
          id: "front",
          label: "Front",
          mockup: previewFront,
          printArea: { xPct: 31.0, yPct: 27.0, widthPct: 40.0, heightPct: 50.0 },
        },
        {
          id: "left",
          label: "Left",
          mockup: previewLeft,
          printArea: { xPct: 40.0, yPct: 27.0, widthPct: 38.0, heightPct: 50.0 },
        },
        {
          id: "right",
          label: "Right",
          mockup: previewRight,
          printArea: { xPct: 24.0, yPct: 27.0, widthPct: 38.0, heightPct: 50.0 },
        },
      ],
      // Bends the flat 2D Preview's design slightly so it reads as wrapped
      // around the mug's curve instead of a flat sticker on top.
      curvedPreview: true,
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
