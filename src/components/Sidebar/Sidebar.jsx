import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Upload04Icon,
  AiMagicIcon,
  TextIcon,
  ShapesIcon,
  FolderLibraryIcon,
  LayoutTemplate,
  ShutterstockIcon,
  FiverrIcon,
} from "@hugeicons/core-free-icons";
import { useProductStore } from "../../store/productStore";

const items = [
  { key: "upload", label: "Upload", icon: Upload04Icon },
  { key: "ai", label: "AI", icon: AiMagicIcon },
  { key: "text", label: "Add text", icon: TextIcon },
  { key: "library", label: "My library", icon: FolderLibraryIcon },
  { key: "graphics", label: "Graphics", icon: ShapesIcon },
  { key: "templates", label: "My templates", icon: LayoutTemplate },
  { key: "shutterstock", label: "Shutterstock", icon: ShutterstockIcon },
  { key: "fiverr", label: "Fiverr", icon: FiverrIcon },
];

export default function Sidebar() {
  const fileInputRef = useRef(null);
  const canvasApi = useProductStore((s) => s.canvasApi);

  const handleClick = (key) => {
    if (key === "upload") fileInputRef.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) canvasApi?.addImageFromFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex h-full w-[76px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-neutral-200 bg-white py-3">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => handleClick(item.key)}
          className="flex w-16 flex-col items-center gap-1 rounded-lg px-1 py-2.5 text-neutral-700 hover:bg-neutral-100"
        >
          <HugeiconsIcon icon={item.icon} size={22} strokeWidth={1.8} />
          <span className="text-[11px] leading-tight">{item.label}</span>
        </button>
      ))}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
