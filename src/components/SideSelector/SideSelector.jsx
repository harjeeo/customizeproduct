import clsx from "clsx";
import { useProductStore } from "../../store/productStore";

export default function SideSelector() {
  const product = useProductStore((s) => s.product);
  const activeSideId = useProductStore((s) => s.activeSideId);
  const setActiveSide = useProductStore((s) => s.setActiveSide);

  return (
    <div className="pointer-events-auto flex gap-2 rounded-full bg-white p-1 shadow-md">
      {product.sides.map((side) => (
        <button
          key={side.id}
          onClick={() => setActiveSide(side.id)}
          className={clsx(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            activeSideId === side.id
              ? "bg-[#4b4a2f] text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          )}
        >
          {side.label}
        </button>
      ))}
    </div>
  );
}
