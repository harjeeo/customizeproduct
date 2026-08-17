import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { productRegistry } from "../../products/registry";
import { useProductStore } from "../../store/productStore";

export default function ProductPicker() {
  const openProduct = useProductStore((s) => s.openProduct);

  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-y-auto bg-[#f7f7f2] px-6 py-16">
      <h1 className="text-3xl font-bold text-neutral-900">Choose a product</h1>
      <p className="mt-2 text-neutral-500">
        Pick what you want to customize — more products are on the way.
      </p>

      <div className="mt-10 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {productRegistry.map((p) => {
          const ready = !!p.config;
          return (
            <button
              key={p.id}
              disabled={!ready}
              onClick={() => ready && openProduct(p.config)}
              className={clsx(
                "flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 transition-colors",
                ready
                  ? "border-neutral-200 hover:border-[#4b4a2f] hover:shadow-md cursor-pointer"
                  : "border-neutral-100 opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                <HugeiconsIcon icon={p.icon} size={30} strokeWidth={1.6} />
              </div>
              <span className="text-sm font-semibold text-neutral-800">{p.name}</span>
              {!ready && (
                <span className="text-xs font-medium text-neutral-400">Coming soon</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
