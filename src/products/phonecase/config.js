import caseBack from "./case-back.svg";
import previewBack from "./preview-back.jpg";

// The mockup SVG's case outline + camera-cutout coordinates are now
// authored to match the preview photo's camera position exactly, so the
// editor and Preview share this one clip shape (case body minus the camera
// hole, expressed as cubic beziers rather than arcs so scalePathD's plain
// "divide every number" normalization doesn't corrupt arc flags; the
// cutout is a second subpath punched out via evenodd fill).
const CASE_AREA = {
  xPct: 30.133,
  yPct: 9.177,
  widthPct: 39.735,
  heightPct: 81.646,
  widthIn: 3.2,
  heightIn: 6.58,
};

const clipPathD =
  "M374.81,91.77 L625.2,91.77 C665.78,91.77 698.68,124.67 698.68,165.25 L698.68,834.75 C698.68,875.33 665.78,908.23 625.2,908.23 L374.81,908.23 C334.23,908.23 301.33,875.33 301.33,834.75 L301.33,165.25 C301.33,124.67 334.23,91.77 374.81,91.77 Z " +
  "M469.13,192.38h-22.73c-6.75,0-12.22-5.47-12.22-12.22v-9.59c0-29.71-24.08-53.79-53.79-53.79h0c-29.71,0-53.79,24.08-53.79,53.79v94.02c0,29.71,24.08,53.79,53.79,53.79h0c29.71,0,53.79-24.08,53.79-53.79v-8.12c0-6.75,5.47-12.22,12.22-12.22h23.27c14.57,0,26.33-12.01,25.92-26.66-.39-14.13-12.33-25.21-26.46-25.21Z";

export const phonecase = {
  id: "phonecase",
  name: "Phone Case",
  canvas: { width: 700, height: 700 },
  sides: [
    {
      id: "back",
      label: "Back",
      mockup: caseBack,
      printArea: CASE_AREA,
      clipPathD,
      previewMockup: previewBack,
      previewPrintArea: CASE_AREA,
      previewClipPathD: clipPathD,
      previewClipRule: "evenodd",
    },
  ],
};
