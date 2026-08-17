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
              {/* mix-blend-mode and filter fight each other when set on the
                  same element (the filter's output gets silently dropped),
                  so the warp lives on the inner img and the blend on this
                  outer wrapper: warp first, then blend the already-warped
                  pixels against the fabric behind for a printed-on look. */}
              <div className="h-full w-full" style={{ mixBlendMode: "multiply" }}>
                <img
                  src={layer.dataUrl}
                  alt=""
                  className="h-full w-full select-none"
                  style={{
                    objectFit: "fill",
                    filter: `url(#fabric-warp-${activeSideId})`,
                  }}
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>

        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            {product.sides.map((side) => (
              <filter
                key={side.id}
                id={`fabric-warp-${side.id}`}
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
                colorInterpolationFilters="sRGB"
              >
                <feImage
                  href={side.previewDisplacementMap}
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  result="dispMapRaw"
                />
                <feGaussianBlur
                  in="dispMapRaw"
                  stdDeviation="2.5"
                  result="dispMap"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="dispMap"
                  scale="9"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            ))}
          </defs>
        </svg>
      </div>
    </div>
  );
}
