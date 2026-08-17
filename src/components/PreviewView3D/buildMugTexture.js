// Renders the current design layers onto a single "unrolled" texture image
// covering the mug's full 360° surface (white ceramic + the print in its
// wrapped slice), for use as a Three.js CanvasTexture.
export function buildMugTexture({ layers, threeD, textureWidth = 2048 }) {
  const textureHeight = Math.round(textureWidth * 0.36);
  const canvas = document.createElement("canvas");
  canvas.width = textureWidth;
  canvas.height = textureHeight;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, textureWidth, textureHeight);

  const printHeightFraction = threeD.printHeightFraction ?? 0.78;
  const printX = threeD.wrapStartFraction * textureWidth;
  const printWidth = threeD.wrapFraction * textureWidth;
  const printHeight = printHeightFraction * textureHeight;
  const printY = (textureHeight - printHeight) / 2;

  const drawLayers = () => {
    layers.forEach((layer) => {
      if (!layer.__img) return;
      const boxW = (layer.widthPct / 100) * printWidth;
      const boxH = (layer.heightPct / 100) * printHeight;
      const boxL = printX + (layer.leftPct / 100) * printWidth;
      const boxT = printY + (layer.topPct / 100) * printHeight;

      ctx.save();
      ctx.translate(boxL + boxW / 2, boxT + boxH / 2);
      ctx.rotate((layer.angle * Math.PI) / 180);
      ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(layer.__img, -boxW / 2, -boxH / 2, boxW, boxH);
      ctx.restore();
    });
  };

  return new Promise((resolve) => {
    if (layers.length === 0) {
      resolve(canvas);
      return;
    }
    let remaining = layers.length;
    layers.forEach((layer) => {
      const img = new Image();
      img.onload = () => {
        layer.__img = img;
        remaining -= 1;
        if (remaining === 0) {
          drawLayers();
          resolve(canvas);
        }
      };
      img.onerror = () => {
        remaining -= 1;
        if (remaining === 0) {
          drawLayers();
          resolve(canvas);
        }
      };
      img.src = layer.dataUrl;
    });
  });
}
