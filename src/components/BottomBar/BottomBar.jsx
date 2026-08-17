import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon, HandIcon } from "@hugeicons/core-free-icons";
import clsx from "clsx";
import { useProductStore } from "../../store/productStore";

export default function BottomBar() {
  const zoom = useProductStore((s) => s.zoom);
  const setZoom = useProductStore((s) => s.setZoom);
  const panMode = useProductStore((s) => s.panMode);
  const togglePanMode = useProductStore((s) => s.togglePanMode);

  return (
    <div className="flex h-14 w-full shrink-0 items-center justify-between border-t border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setZoom(zoom - 10)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={MinusSignIcon} size={16} />
        </button>
        <div className="flex h-8 items-center gap-1 rounded-md border border-neutral-300 px-3 text-sm font-medium text-neutral-700">
          {Math.round(zoom)}%
        </div>
        <button
          onClick={() => setZoom(zoom + 10)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
        </button>
        <button
          title="Hand tool — drag canvas to pan"
          onClick={togglePanMode}
          className={clsx(
            "ml-1 flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100",
            panMode ? "bg-[#4b4a2f] text-white hover:bg-[#4b4a2f]" : "text-neutral-600"
          )}
        >
          <HugeiconsIcon icon={HandIcon} size={17} />
        </button>
      </div>

      <button className="h-10 rounded-lg bg-lime-400 px-6 text-sm font-bold text-neutral-900 hover:bg-lime-300">
        Save product
      </button>
    </div>
  );
}
