// Helpers to convert between fabric object geometry (px, canvas space)
// and the "human" units shown in the right panel (inches, %, deg).

export function getPrintAreaPx(canvas, printArea) {
  return {
    x: (printArea.xPct / 100) * canvas.width,
    y: (printArea.yPct / 100) * canvas.height,
    width: (printArea.widthPct / 100) * canvas.width,
    height: (printArea.heightPct / 100) * canvas.height,
  };
}

export function objectToPanelValues(obj, canvas, printArea) {
  const area = getPrintAreaPx(canvas, printArea);
  const pxPerInchX = area.width / printArea.widthIn;
  const pxPerInchY = area.height / printArea.heightIn;

  const boxWidth = obj.getScaledWidth();
  const boxHeight = obj.getScaledHeight();
  const leftEdge = obj.left - boxWidth / 2;
  const topEdge = obj.top - boxHeight / 2;

  return {
    widthIn: boxWidth / pxPerInchX,
    heightIn: boxHeight / pxPerInchY,
    rotateDeg: obj.angle ?? 0,
    scalePct: (obj.scaleX ?? 1) * 100,
    positionLeftPct: ((leftEdge - area.x) / area.width) * 100,
    positionTopPct: ((topEdge - area.y) / area.height) * 100,
  };
}

export function applyWidthIn(obj, canvas, printArea, widthIn) {
  const area = getPrintAreaPx(canvas, printArea);
  const pxPerInchX = area.width / printArea.widthIn;
  const targetPx = widthIn * pxPerInchX;
  const ratio = targetPx / (obj.width || 1);
  obj.set({ scaleX: ratio, scaleY: ratio });
}

export function applyHeightIn(obj, canvas, printArea, heightIn) {
  const area = getPrintAreaPx(canvas, printArea);
  const pxPerInchY = area.height / printArea.heightIn;
  const targetPx = heightIn * pxPerInchY;
  const ratio = targetPx / (obj.height || 1);
  obj.set({ scaleX: ratio, scaleY: ratio });
}

export function applyScalePct(obj, scalePct) {
  const ratio = scalePct / 100;
  obj.set({ scaleX: ratio, scaleY: ratio });
}

export function applyRotateDeg(obj, deg) {
  obj.set({ angle: deg });
}

export function applyPositionLeftPct(obj, canvas, printArea, pct) {
  const area = getPrintAreaPx(canvas, printArea);
  const boxWidth = obj.getScaledWidth();
  const leftEdge = area.x + (pct / 100) * area.width;
  obj.set({ left: leftEdge + boxWidth / 2 });
}

export function applyPositionTopPct(obj, canvas, printArea, pct) {
  const area = getPrintAreaPx(canvas, printArea);
  const boxHeight = obj.getScaledHeight();
  const topEdge = area.y + (pct / 100) * area.height;
  obj.set({ top: topEdge + boxHeight / 2 });
}

export function centerInPrintArea(obj, canvas, printArea) {
  const area = getPrintAreaPx(canvas, printArea);
  obj.set({
    left: area.x + area.width / 2,
    top: area.y + area.height / 2,
  });
}

export function alignInPrintArea(obj, canvas, printArea, axis, edge) {
  const area = getPrintAreaPx(canvas, printArea);
  if (axis === "x") {
    const boxWidth = obj.getScaledWidth();
    if (edge === "start") obj.set({ left: area.x + boxWidth / 2 });
    if (edge === "center") obj.set({ left: area.x + area.width / 2 });
    if (edge === "end")
      obj.set({ left: area.x + area.width - boxWidth / 2 });
  } else {
    const boxHeight = obj.getScaledHeight();
    if (edge === "start") obj.set({ top: area.y + boxHeight / 2 });
    if (edge === "center") obj.set({ top: area.y + area.height / 2 });
    if (edge === "end")
      obj.set({ top: area.y + area.height - boxHeight / 2 });
  }
}
