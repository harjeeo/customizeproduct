import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";

export default function PreviewView() {
  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const canvasApi = useProductStore((s) => s.canvasApi);
  const [layers, setLayers] = useState([]);

  const activeSide = product.sides.find((s) => s.id === activeSideId);

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
            left: `${activeSide.previewPrintArea.xPct}%`,
            top: `${activeSide.previewPrintArea.yPct}%`,
            width: `${activeSide.previewPrintArea.widthPct}%`,
            height: `${activeSide.previewPrintArea.heightPct}%`,
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
