import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon, HandIcon } from "@hugeicons/core-free-icons";
import { useProductStore } from "../../store/productStore";

export default function BottomBar() {
  const zoom = useProductStore((s) => s.zoom);
  const setZoom = useProductStore((s) => s.setZoom);

  return (
    <div className="flex h-14 w-full shrink-0 items-center justify-between border-t border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setZoom(zoom - 5)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={MinusSignIcon} size={16} />
        </button>
        <div className="flex h-8 items-center gap-1 rounded-md border border-neutral-300 px-3 text-sm font-medium text-neutral-700">
          {Math.round(zoom)}%
        </div>
        <button
          onClick={() => setZoom(zoom + 5)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
        </button>
        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100">
          <HugeiconsIcon icon={HandIcon} size={17} />
        </button>
      </div>

      <button className="h-10 rounded-lg bg-lime-400 px-6 text-sm font-bold text-neutral-900 hover:bg-lime-300">
        Save product
      </button>
    </div>
  );
}
