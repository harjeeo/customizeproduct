import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";
import { scalePathD } from "../../lib/svgPath";
import { getCylinderBumpDataUrl } from "../../lib/cylinderBump";
import PreviewView3D from "../PreviewView3D/PreviewView3D";
import MockupViewPanel from "../MockupViewPanel/MockupViewPanel";

export default function PreviewView() {
  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const canvasApi = useProductStore((s) => s.canvasApi);
  const mockupViewId = useProductStore((s) => s.mockupViewId);
  const [layers, setLayers] = useState([]);

  const activeSide = product.sides.find((s) => s.id === activeSideId);

  const mockups =
    activeSide.previewMockups ??
    (activeSide.previewMockup
      ? [{ id: "default", label: activeSide.label, mockup: activeSide.previewMockup, printArea: activeSide.previewPrintArea }]
      : []);
  const activeMockup = mockups.find((m) => m.id === mockupViewId) ?? mockups[0];
  const pa = activeMockup.printArea;

  const clipId = `preview-clip-${activeSideId}`;
  // Preview prefers its own (usually bigger, true full-bleed) clip shape,
  // falling back to the editor's clip if a product doesn't need a separate one.
  const previewClipD = activeSide.previewClipPathD ?? activeSide.clipPathD;
  const curved = !!activeSide.curvedPreview;
  const bumpId = `cylinder-bump-${activeSideId}`;

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
          {/* mix-blend-mode and filter fight when set on the same element
              (filter's output gets dropped), so the curve/bend lives on the
              inner img and the blend on this outer wrapper. */}
          <div className="h-full w-full" style={{ mixBlendMode: "multiply" }}>
            <img
              src={layer.dataUrl}
              alt=""
              className="h-full w-full select-none"
              style={{
                objectFit: "fill",
                filter: curved ? `url(#${bumpId})` : undefined,
              }}
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-full w-full">
      <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-[#eef0e9] p-8">
        <div className="relative aspect-square w-full max-w-[720px]">
          <img
            src={activeMockup.mockup}
            alt={activeMockup.label}
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

          {curved && (
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <filter id={bumpId} x="-15%" y="-40%" width="130%" height="180%">
                  <feImage
                    href={getCylinderBumpDataUrl()}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    result="bump"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="bump"
                    scale="22"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
            </svg>
          )}

          <PreviewView3D
            activeSide={activeSide}
            canvasApi={canvasApi}
            activeSideId={activeSideId}
          />
        </div>
      </div>

      {mockups.length > 1 && <MockupViewPanel mockups={mockups} />}
    </div>
  );
}
