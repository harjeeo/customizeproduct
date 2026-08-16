import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Delete02Icon,
  AlignLeftIcon,
  AlignHorizontalCenterIcon,
  AlignRightIcon,
  AlignTopIcon,
  AlignVerticalCenterIcon,
  AlignBottomIcon,
} from "@hugeicons/core-free-icons";
import { useProductStore } from "../../store/productStore";

function Field({ label, value, unit, onCommit, step = 0.01 }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-neutral-500">{label}</label>
      <div className="flex items-center rounded-lg border border-neutral-300 bg-white pr-3">
        <input
          type="number"
          step={step}
          value={Number.isFinite(value) ? Number(value.toFixed(2)) : ""}
          onChange={(e) => onCommit(parseFloat(e.target.value))}
          className="w-full min-w-0 rounded-lg px-3 py-2.5 text-sm text-neutral-900 outline-none"
        />
        <span className="text-sm text-neutral-400">{unit}</span>
      </div>
    </div>
  );
}

export default function RightPanel({ onClose }) {
  const canvasApi = useProductStore((s) => s.canvasApi);
  const panelValues = useProductStore((s) => s.panelValues);
  const meta = useProductStore((s) => s.selectedLayerMeta);
  const hasSelection = useProductStore((s) => !!s.selectedLayerId);

  return (
    <div className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold text-neutral-900">Variants and layers</h2>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </button>
      </div>

      {!hasSelection || !panelValues ? (
        <div className="px-5 py-8 text-sm text-neutral-400">
          Kisi design/layer ko select karein transform properties dekhne ke liye.
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-5 pb-6">
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2">
            {meta?.thumbnail && (
              <img
                src={meta.thumbnail}
                alt=""
                className="h-12 w-12 rounded-md object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {meta?.name ?? "Layer"}
              </p>
              <p className="truncate text-xs font-medium text-orange-500">
                {meta?.resolutionLabel}
              </p>
            </div>
            <button
              onClick={() => canvasApi?.deleteSelected()}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-red-500"
            >
              <HugeiconsIcon icon={Delete02Icon} size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Width"
              unit="in"
              value={panelValues.widthIn}
              onCommit={(v) => Number.isFinite(v) && canvasApi?.setWidthIn(v)}
            />
            <Field
              label="Height"
              unit="in"
              value={panelValues.heightIn}
              onCommit={(v) => Number.isFinite(v) && canvasApi?.setHeightIn(v)}
            />
            <Field
              label="Rotate"
              unit="deg"
              step={1}
              value={panelValues.rotateDeg}
              onCommit={(v) => Number.isFinite(v) && canvasApi?.setRotateDeg(v)}
            />
            <Field
              label="Scale"
              unit="%"
              step={0.1}
              value={panelValues.scalePct}
              onCommit={(v) => Number.isFinite(v) && canvasApi?.setScalePct(v)}
            />
            <Field
              label="Position left"
              unit="%"
              value={panelValues.positionLeftPct}
              onCommit={(v) =>
                Number.isFinite(v) && canvasApi?.setPositionLeftPct(v)
              }
            />
            <Field
              label="Position top"
              unit="%"
              value={panelValues.positionTopPct}
              onCommit={(v) =>
                Number.isFinite(v) && canvasApi?.setPositionTopPct(v)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex rounded-lg border border-neutral-300">
              {[
                { icon: AlignLeftIcon, edge: "start" },
                { icon: AlignHorizontalCenterIcon, edge: "center" },
                { icon: AlignRightIcon, edge: "end" },
              ].map(({ icon, edge }) => (
                <button
                  key={edge}
                  onClick={() => canvasApi?.align("x", edge)}
                  className="flex h-10 flex-1 items-center justify-center text-neutral-700 hover:bg-neutral-100 first:rounded-l-lg last:rounded-r-lg"
                >
                  <HugeiconsIcon icon={icon} size={17} />
                </button>
              ))}
            </div>
            <div className="flex rounded-lg border border-neutral-300">
              {[
                { icon: AlignTopIcon, edge: "start" },
                { icon: AlignVerticalCenterIcon, edge: "center" },
                { icon: AlignBottomIcon, edge: "end" },
              ].map(({ icon, edge }) => (
                <button
                  key={edge}
                  onClick={() => canvasApi?.align("y", edge)}
                  className="flex h-10 flex-1 items-center justify-center text-neutral-700 hover:bg-neutral-100 first:rounded-l-lg last:rounded-r-lg"
                >
                  <HugeiconsIcon icon={icon} size={17} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
