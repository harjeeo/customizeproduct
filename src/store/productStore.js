import { create } from "zustand";
import { tshirt } from "../products/tshirt/config";

export const useProductStore = create((set, get) => ({
  product: tshirt,
  activeSideId: tshirt.sides[0].id,
  view: "edit", // "edit" | "preview"
  zoom: 100,
  pan: { x: 0, y: 0 },
  panMode: false,

  selectedLayerId: null,
  // panelValues mirrors the selected fabric object's transform in human units
  // (inches / % / deg), kept in sync by the Canvas component.
  panelValues: null,
  // { thumbnail, name, resolutionLabel } for the header card in the right panel
  selectedLayerMeta: null,

  // set imperatively by the Canvas component once fabric.Canvas is ready
  canvasApi: null,

  setCanvasApi: (api) => set({ canvasApi: api }),

  setActiveSide: (sideId) =>
    set({ activeSideId: sideId, selectedLayerId: null, panelValues: null, selectedLayerMeta: null }),

  setView: (view) => set({ view }),

  setZoom: (zoom) => set({ zoom: Math.min(400, Math.max(5, zoom)) }),

  setPan: (pan) => set({ pan }),
  panBy: (dx, dy) =>
    set((state) => ({ pan: { x: state.pan.x + dx, y: state.pan.y + dy } })),
  resetView: () => set({ zoom: 100, pan: { x: 0, y: 0 } }),

  setPanMode: (panMode) => set({ panMode }),
  togglePanMode: () => set((state) => ({ panMode: !state.panMode })),

  setSelection: (layerId, panelValues, meta) =>
    set({ selectedLayerId: layerId, panelValues, selectedLayerMeta: meta }),

  clearSelection: () =>
    set({ selectedLayerId: null, panelValues: null, selectedLayerMeta: null }),

  updatePanelValues: (patch) =>
    set((state) => ({ panelValues: { ...state.panelValues, ...patch } })),

  getActiveSide: () => {
    const state = get();
    return state.product.sides.find((s) => s.id === state.activeSideId);
  },
}));
