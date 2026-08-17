import caseBack from "./case-back.svg";
import previewBack from "./preview-back.jpg";

// Both boxes below are in % of the mockup canvas (source viewBox 0 0 1000
// 1000) and share the same real-world inches, matching the case's true
// full outline (edge to edge) — not the smaller "safe zone" guide the SVG
// shipped with — since real sublimation print covers the whole case.
const FULL_CASE_AREA = {
  xPct: 30.892,
  yPct: 10.45,
  widthPct: 38.215,
  heightPct: 79.1,
  widthIn: 3.2,
  heightIn: 6.6,
};

// The editor keeps clipping to this smaller "safe zone" guide (from the
// SVG's dashed print-safe path) as a caution against placing important
// content where it'd sit right at the case edge or camera notch.
const editorClipPathD =
  "M614.87,122.94h-183.14c15.57,13.32,25.45,33.09,25.45,55.19v6.66h15.04c23.91,0,43.29,19.38,43.29,43.29h0c0,23.91-19.38,43.29-43.29,43.29h-15.08c-.76,39.45-32.96,71.19-72.59,71.19h0c-24.05,0-45.35-11.69-58.57-29.7v505.92c0,32.67,26.48,59.15,59.15,59.15h229.74c32.67,0,59.15-26.48,59.15-59.15V182.09c0-32.67-26.48-59.15-59.15-59.15Z";

// Preview clips to the case's true full outline (rounded-rect, expressed as
// cubic beziers rather than arcs so scalePathD's plain "divide every number"
// approach doesn't corrupt arc flags) with the camera cutout punched out via
// a second subpath + evenodd fill — this is what actually prints edge to
// edge, camera hole excluded.
const previewClipPathD =
  "M382.4,104.5 L617.59,104.5 C658.17,104.5 691.07,137.4 691.07,177.98 L691.07,822.02 C691.07,862.6 658.17,895.5 617.59,895.5 L382.4,895.5 C341.82,895.5 308.92,862.6 308.92,822.02 L308.92,177.98 C308.92,137.4 341.82,104.5 382.4,104.5 Z " +
  "M471.04,202.5h-23.22c-5.88,0-10.65-4.77-10.65-10.65v-9.75c0-28.89-23.42-52.31-52.31-52.31h0c-28.89,0-52.31,23.42-52.31,52.31v88.41c0,28.89,23.42,52.31,52.31,52.31h0c28.89,0,52.31-23.42,52.31-52.31v-5.3c0-5.88,4.77-10.65,10.65-10.65h23.22c14.37,0,26.03-11.65,26.03-26.03h0c0-14.37-11.65-26.03-26.03-26.03Z";

export const phonecase = {
  id: "phonecase",
  name: "Phone Case",
  canvas: { width: 700, height: 700 },
  sides: [
    {
      id: "back",
      label: "Back",
      mockup: caseBack,
      printArea: FULL_CASE_AREA,
      clipPathD: editorClipPathD,
      previewMockup: previewBack,
      previewPrintArea: FULL_CASE_AREA,
      previewClipPathD,
      previewClipRule: "evenodd",
    },
  ],
};
