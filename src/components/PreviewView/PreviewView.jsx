import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";
import { scalePathD } from "../../lib/svgPath";

export default function PreviewView() {
  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const canvasApi = useProductStore((s) => s.canvasApi);
  const [layers, setLayers] = useState([]);

  const activeSide = product.sides.find((s) => s.id === activeSideId);
  const pa = activeSide.previewPrintArea;
  const clipId = `preview-clip-${activeSideId}`;
  // Preview prefers its own (usually bigger, true full-bleed) clip shape,
  // falling back to the editor's clip if a product doesn't need a separate one.
  const previewClipD = activeSide.previewClipPathD ?? activeSide.clipPathD;

  useEffect(() => {
    if (!canvasApi) return;
    setLayers(canvasApi.getLayersForSide(activeSideId));
  }, [canvasApi, activeSideId]);

  const layersBox = (
    <div
      className="absolute overflow-hidden"
      style={{
        left: `${pa.xPct}%`,
        top: `${pa.yPct}%`,
        width: `${pa.widthPct}%`,
        height: `${pa.heightPct}%`,
      }}
    >
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="absolute"
          style={{
            left: `${layer.leftPct}%`,
            top: `${layer.topPct}%`,
            width: `${layer.widthPct}%`,
            height: `${layer.heightPct}%`,
            transform: `rotate(${layer.angle}deg) scaleX(${
              layer.flipX ? -1 : 1
            }) scaleY(${layer.flipY ? -1 : 1})`,
            transformOrigin: "center center",
          }}
        >
          {/* mix-blend-mode lets the fabric's own shading show through
              the design for a printed-on look, without warping it. */}
          <img
            src={layer.dataUrl}
            alt=""
            className="h-full w-full select-none"
            style={{ objectFit: "fill", mixBlendMode: "multiply" }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#eef0e9] p-8">
      <div className="relative aspect-square w-full max-w-[720px]">
        <img
          src={activeSide.previewMockup}
          alt={activeSide.label}
          className="absolute inset-0 h-full w-full select-none rounded-lg object-cover"
          draggable={false}
        />

        {previewClipD ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                clipPath: `url(#${clipId})`,
                // subtle bevel/emboss along the print edge so it reads as
                // pressed into the product surface rather than a flat sticker
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.65), " +
                  "inset 0 -1.5px 2px rgba(0,0,0,0.28), " +
                  "inset 1px 0 1px rgba(255,255,255,0.35), " +
                  "inset -1px 0 1px rgba(0,0,0,0.18)",
              }}
            >
              {layersBox}
            </div>
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                  <path
                    d={scalePathD(previewClipD, 1000)}
                    clipRule={activeSide.previewClipRule}
                  />
                </clipPath>
              </defs>
            </svg>
          </>
        ) : (
          layersBox
        )}
      </div>
    </div>
  );
}
