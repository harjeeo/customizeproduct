import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  InformationCircleIcon,
  Undo02Icon,
  Redo02Icon,
  Move02Icon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  FitToScreenIcon,
  Maximize01Icon,
  GridIcon,
  DragDropVerticalIcon,
  CropIcon,
  Copy01Icon,
  Delete02Icon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons";
import clsx from "clsx";
import { useProductStore } from "../../store/productStore";

function IconButton({ icon, onClick, disabled, title, active }) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100",
        active ? "bg-[#4b4a2f] text-white hover:bg-[#4b4a2f]" : "text-neutral-700",
        disabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
      )}
    >
      <HugeiconsIcon icon={icon} size={19} strokeWidth={1.8} />
    </button>
  );
}

export default function Toolbar({ panelOpen, onTogglePanel }) {
  const canvasApi = useProductStore((s) => s.canvasApi);
  const view = useProductStore((s) => s.view);
  const setView = useProductStore((s) => s.setView);
  const hasSelection = useProductStore((s) => !!s.selectedLayerId);

  return (
    <div className="flex h-14 w-full shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-1">
        <IconButton icon={ArrowLeft01Icon} title="Back" />
        <div className="mx-1 h-6 w-px bg-neutral-200" />
        <IconButton icon={InformationCircleIcon} title="Info" />
        <IconButton icon={Undo02Icon} title="Undo" />
        <IconButton icon={Redo02Icon} title="Redo" />
        <div className="mx-1 h-6 w-px bg-neutral-200" />
        <button className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-100">
          <HugeiconsIcon icon={Move02Icon} size={18} strokeWidth={1.8} />
          Position
        </button>
        <IconButton
          icon={FlipHorizontalIcon}
          title="Flip horizontal"
          disabled={!hasSelection}
          onClick={() => canvasApi?.flip("x")}
        />
        <IconButton
          icon={FlipVerticalIcon}
          title="Flip vertical"
          disabled={!hasSelection}
          onClick={() => canvasApi?.flip("y")}
        />
        <IconButton
          icon={FitToScreenIcon}
          title="Center in area"
          disabled={!hasSelection}
          onClick={() => canvasApi?.centerSelected()}
        />
        <IconButton icon={Maximize01Icon} title="Fit" />
        <IconButton icon={GridIcon} title="Toggle grid" />
        <IconButton icon={DragDropVerticalIcon} title="Layers" />
        <IconButton icon={CropIcon} title="Crop" disabled={!hasSelection} />
        <IconButton
          icon={Copy01Icon}
          title="Duplicate"
          disabled={!hasSelection}
          onClick={() => canvasApi?.duplicateSelected()}
        />
        <IconButton
          icon={Delete02Icon}
          title="Delete"
          disabled={!hasSelection}
          onClick={() => canvasApi?.deleteSelected()}
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 rounded-lg px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-100">
          Apply to all areas
        </button>
        <button className="h-9 rounded-lg border border-neutral-300 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
          Save as template
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-full bg-neutral-100 p-1">
          <button
            onClick={() => setView("edit")}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold",
              view === "edit"
                ? "bg-[#4b4a2f] text-white"
                : "text-neutral-600"
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setView("preview")}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold",
              view === "preview"
                ? "bg-[#4b4a2f] text-white"
                : "text-neutral-600"
            )}
          >
            Preview
          </button>
        </div>
        <IconButton
          icon={PuzzleIcon}
          title="Variants and layers"
          active={panelOpen}
          onClick={onTogglePanel}
        />
      </div>
    </div>
  );
}
