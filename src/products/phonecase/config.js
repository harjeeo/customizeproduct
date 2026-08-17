import caseBack from "./case-back.svg";
import previewBack from "./preview-back.jpg";

// Print area is defined in % of the mockup canvas (source viewBox 0 0 1000 1000),
// taken from the SVG's dashed guide (its bounding box — the guide shape
// itself dodges the camera cutout, we just use a rectangle approximation
// like the t-shirt print areas do).
export const phonecase = {
  id: "phonecase",
  name: "Phone Case",
  canvas: { width: 700, height: 700 },
  sides: [
    {
      id: "back",
      label: "Back",
      mockup: caseBack,
      printArea: {
        xPct: 32.5,
        yPct: 12.2,
        widthPct: 34.9,
        heightPct: 75.6,
        widthIn: 2.9,
        heightIn: 6.3,
      },
      previewMockup: previewBack,
      previewPrintArea: {
        xPct: 32.5,
        yPct: 12.2,
        widthPct: 34.9,
        heightPct: 75.6,
      },
    },
  ],
};
