import clsx from "clsx";
import { useProductStore } from "../../store/productStore";

export default function MockupViewPanel({ mockups }) {
  const mockupViewId = useProductStore((s) => s.mockupViewId);
  const setMockupViewId = useProductStore((s) => s.setMockupViewId);
  const activeId = mockupViewId ?? mockups[0].id;

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col overflow-y-auto border-l border-neutral-200 bg-white px-5 py-4">
      <h2 className="mb-4 text-lg font-bold text-neutral-900">Mockup view</h2>
      <div className="grid grid-cols-3 gap-3">
        {mockups.map((m) => (
          <button
            key={m.id}
            onClick={() => setMockupViewId(m.id)}
            className="flex flex-col items-center gap-1.5"
          >
            <span
              className={clsx(
                "flex h-16 w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-white",
                activeId === m.id
                  ? "border-[#4b4a2f]"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <img
                src={m.mockup}
                alt={m.label}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </span>
            <span className="text-xs font-medium text-neutral-600">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
