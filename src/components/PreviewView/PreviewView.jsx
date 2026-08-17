import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";

export default function PreviewView() {
  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const canvasApi = useProductStore((s) => s.canvasApi);
  const [layers, setLayers] = useState([]);

  const activeSide = product.sides.find((s) => s.id === activeSideId);
  const pa = activeSide.previewPrintArea;

  useEffect(() => {
    if (!canvasApi) return;
    setLayers(canvasApi.getLayersForSide(activeSideId));
  }, [canvasApi, activeSideId]);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#eef0e9] p-8">
      <div className="relative aspect-square w-full max-w-[720px]">
        <img
          src={activeSide.previewMockup}
          alt={activeSide.label}
          className="absolute inset-0 h-full w-full select-none rounded-lg object-cover"
          draggable={false}
        />

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
      </div>
    </div>
  );
}
