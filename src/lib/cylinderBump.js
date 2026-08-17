// A small synthetic "bump map" data URL used to bend a flat design image so
// it reads as wrapped around a cylinder (mug, bottle, ...) instead of sitting
// on top as a flat sticker: green channel encodes a vertical arc (bulges near
// the middle, settles at the edges) for an feDisplacementMap Y-channel.
let cached = null;

export function getCylinderBumpDataUrl() {
  if (cached) return cached;

  const width = 256;
  const height = 64;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  for (let x = 0; x < width; x++) {
    const nx = (x / width) * 2 - 1; // -1..1
    const bulge = Math.cos((nx * Math.PI) / 2); // 1 at center, 0 at edges
    const g = Math.round(128 + bulge * 90);
    ctx.fillStyle = `rgb(128,${g},128)`;
    ctx.fillRect(x, 0, 1, height);
  }

  cached = canvas.toDataURL();
  return cached;
}
