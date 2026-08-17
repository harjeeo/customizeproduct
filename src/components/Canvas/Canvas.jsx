import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useProductStore } from "../../store/productStore";
import {
  objectToPanelValues,
  applyWidthIn,
  applyHeightIn,
  applyScalePct,
  applyRotateDeg,
  applyPositionLeftPct,
  applyPositionTopPct,
  centerInPrintArea,
  alignInPrintArea,
} from "../../lib/fabricMath";

let layerIdCounter = 1;
const nextLayerId = () => `layer-${layerIdCounter++}`;

export default function Canvas() {
  const wrapperRef = useRef(null);
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const sideObjectsRef = useRef({});
  const hasFitRef = useRef(false);
  const panDragRef = useRef(null);

  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const setCanvasApi = useProductStore((s) => s.setCanvasApi);
  const setSelection = useProductStore((s) => s.setSelection);
  const clearSelection = useProductStore((s) => s.clearSelection);
  const zoom = useProductStore((s) => s.zoom);
  const setZoom = useProductStore((s) => s.setZoom);
  const pan = useProductStore((s) => s.pan);
  const panBy = useProductStore((s) => s.panBy);
  const panMode = useProductStore((s) => s.panMode);

  const activeSide = product.sides.find((s) => s.id === activeSideId);

  // init fabric canvas once
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: product.canvas.width,
      height: product.canvas.height,
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;
    product.sides.forEach((s) => (sideObjectsRef.current[s.id] = []));

    const emitSelection = () => {
      const obj = canvas.getActiveObject();
      if (!obj) {
        clearSelection();
        return;
      }
      const side = useProductStore.getState().getActiveSide();
      const panelValues = objectToPanelValues(obj, canvas, side.printArea);
      setSelection(obj.__layerId, panelValues, obj.__meta ?? null);
    };

    canvas.on("selection:created", emitSelection);
    canvas.on("selection:updated", emitSelection);
    canvas.on("selection:cleared", () => clearSelection());
    canvas.on("object:moving", emitSelection);
    canvas.on("object:scaling", emitSelection);
    canvas.on("object:rotating", emitSelection);
    canvas.on("object:modified", emitSelection);

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fit the canvas to the container once, on first measurement only —
  // after that the user drives zoom/pan themselves via the bottom bar.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (hasFitRef.current) return;
      const availW = el.clientWidth - 64;
      const availH = el.clientHeight - 64;
      if (availW <= 0 || availH <= 0) return;
      const fit = Math.min(
        availW / product.canvas.width,
        availH / product.canvas.height,
        1.1
      );
      if (fit > 0) {
        hasFitRef.current = true;
        useProductStore.getState().setZoom(fit * 100);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [product.canvas.width, product.canvas.height]);

  // toggle fabric interactivity while the hand/pan tool is active
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.selection = !panMode;
    canvas.skipTargetFind = panMode;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }, [panMode]);

  // swap objects when side changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.getObjects().forEach((o) => canvas.remove(o));
    (sideObjectsRef.current[activeSideId] ?? []).forEach((o) =>
      canvas.add(o)
    );
    canvas.requestRenderAll();
    clearSelection();
  }, [activeSideId, clearSelection]);

  // expose imperative API to the rest of the app
  useEffect(() => {
    const getCanvas = () => fabricRef.current;
    const getSide = () => useProductStore.getState().getActiveSide();
    const getSelected = () => getCanvas()?.getActiveObject() ?? null;

    const syncSelection = () => {
      const obj = getSelected();
      if (!obj) return;
      const panelValues = objectToPanelValues(obj, getCanvas(), getSide().printArea);
      setSelection(obj.__layerId, panelValues, obj.__meta ?? null);
    };

    const api = {
      addImageFromFile: (file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result;
          fabric.FabricImage.fromURL(dataUrl, { crossOrigin: "anonymous" }).then(
            (img) => {
              const canvas = getCanvas();
              const side = getSide();
              const areaW = (side.printArea.widthPct / 100) * product.canvas.width;
              const targetW = areaW * 0.7;
              const ratio = targetW / img.width;

              img.set({
                originX: "center",
                originY: "center",
                scaleX: ratio,
                scaleY: ratio,
                left: product.canvas.width / 2,
                top: product.canvas.height / 2,
                cornerColor: "#4ade80",
                cornerStrokeColor: "#16a34a",
                borderColor: "#4ade80",
                cornerSize: 10,
                transparentCorners: false,
                cornerStyle: "rect",
              });
              img.__layerId = nextLayerId();
              img.__meta = {
                name: file.name.replace(/\.[^/.]+$/, ""),
                thumbnail: dataUrl,
                resolutionLabel: "Medium resolution (101 DPI)",
              };

              centerInPrintArea(img, canvas, side.printArea);
              canvas.add(img);
              canvas.setActiveObject(img);
              sideObjectsRef.current[activeSideId] = canvas.getObjects();
              canvas.requestRenderAll();
              syncSelection();
            }
          );
        };
        reader.readAsDataURL(file);
      },

      deleteSelected: () => {
        const canvas = getCanvas();
        const obj = getSelected();
        if (!obj) return;
        canvas.remove(obj);
        sideObjectsRef.current[activeSideId] = canvas.getObjects();
        canvas.requestRenderAll();
        clearSelection();
      },

      duplicateSelected: async () => {
        const canvas = getCanvas();
        const obj = getSelected();
        if (!obj) return;
        const clone = await obj.clone();
        clone.set({
          left: obj.left + 20,
          top: obj.top + 20,
          __layerId: nextLayerId(),
          __meta: obj.__meta,
        });
        canvas.add(clone);
        canvas.setActiveObject(clone);
        sideObjectsRef.current[activeSideId] = canvas.getObjects();
        canvas.requestRenderAll();
        syncSelection();
      },

      flip: (axis) => {
        const obj = getSelected();
        if (!obj) return;
        if (axis === "x") obj.set({ flipX: !obj.flipX });
        else obj.set({ flipY: !obj.flipY });
        getCanvas().requestRenderAll();
        syncSelection();
      },

      centerSelected: () => {
        const obj = getSelected();
        if (!obj) return;
        centerInPrintArea(obj, getCanvas(), getSide().printArea);
        getCanvas().requestRenderAll();
        syncSelection();
      },

      align: (axis, edge) => {
        const obj = getSelected();
        if (!obj) return;
        alignInPrintArea(obj, getCanvas(), getSide().printArea, axis, edge);
        getCanvas().requestRenderAll();
        syncSelection();
      },

      setWidthIn: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyWidthIn(obj, getCanvas(), getSide().printArea, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
      setHeightIn: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyHeightIn(obj, getCanvas(), getSide().printArea, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
      setScalePct: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyScalePct(obj, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
      setRotateDeg: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyRotateDeg(obj, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
      setPositionLeftPct: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyPositionLeftPct(obj, getCanvas(), getSide().printArea, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
      setPositionTopPct: (val) => {
        const obj = getSelected();
        if (!obj) return;
        applyPositionTopPct(obj, getCanvas(), getSide().printArea, val);
        getCanvas().requestRenderAll();
        syncSelection();
      },
    };

    setCanvasApi(api);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSideId, product, setCanvasApi, setSelection, clearSelection]);

  const handlePointerDown = (e) => {
    if (!panMode) return;
    panDragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!panMode || !panDragRef.current) return;
    const dx = e.clientX - panDragRef.current.x;
    const dy = e.clientY - panDragRef.current.y;
    panDragRef.current = { x: e.clientX, y: e.clientY };
    panBy(dx, dy);
  };
  const handlePointerUp = (e) => {
    panDragRef.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(zoom - e.deltaY * 0.4);
  };

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#eef0e9] ${
        panMode ? (panDragRef.current ? "cursor-grabbing" : "cursor-grab") : ""
      }`}
    >
      <div
        className="relative"
        style={{
          width: product.canvas.width,
          height: product.canvas.height,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
        }}
      >
        <img
          src={activeSide.mockup}
          alt={activeSide.label}
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute border border-dashed border-neutral-400"
          style={{
            left: `${activeSide.printArea.xPct}%`,
            top: `${activeSide.printArea.yPct}%`,
            width: `${activeSide.printArea.widthPct}%`,
            height: `${activeSide.printArea.heightPct}%`,
          }}
        />
        <canvas ref={canvasElRef} />
      </div>
    </div>
  );
}
