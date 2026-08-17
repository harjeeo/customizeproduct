import caseBack from "./case-back.svg";
import previewBack from "./preview-back.jpg";

// Print area is defined in % of the mockup canvas (source viewBox 0 0 1000 1000),
// taken from the SVG's dashed guide (its bounding box — the guide shape
// itself dodges the camera cutout, we just use a rectangle approximation
// like the t-shirt print areas do).
//
// clipPathD is that same guide shape's raw path data (still in the 0-1000
// viewBox space) — used to actually clip designs to the case body and dodge
// the camera cutout, in both the editor canvas and the Preview overlay,
// instead of letting them spill outside the case or over the cutout.
const clipPathD =
  "M614.87,122.94h-183.14c15.57,13.32,25.45,33.09,25.45,55.19v6.66h15.04c23.91,0,43.29,19.38,43.29,43.29h0c0,23.91-19.38,43.29-43.29,43.29h-15.08c-.76,39.45-32.96,71.19-72.59,71.19h0c-24.05,0-45.35-11.69-58.57-29.7v505.92c0,32.67,26.48,59.15,59.15,59.15h229.74c32.67,0,59.15-26.48,59.15-59.15V182.09c0-32.67-26.48-59.15-59.15-59.15Z";

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
      clipPathD,
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
