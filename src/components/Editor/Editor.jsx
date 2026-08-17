import { useState } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Sidebar from "../Sidebar/Sidebar";
import Canvas from "../Canvas/Canvas";
import PreviewView from "../PreviewView/PreviewView";
import RightPanel from "../RightPanel/RightPanel";
import SideSelector from "../SideSelector/SideSelector";
import BottomBar from "../BottomBar/BottomBar";
import { useProductStore } from "../../store/productStore";

export default function Editor() {
  const [panelOpen, setPanelOpen] = useState(true);
  const view = useProductStore((s) => s.view);
  const closeProduct = useProductStore((s) => s.closeProduct);

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      <Toolbar
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
        onBack={closeProduct}
      />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* Canvas stays mounted (just hidden) so switching to Preview and
              back never loses the fabric.js layer state. */}
          <div className={view === "edit" ? "contents" : "hidden"}>
            <Canvas />
          </div>
          {view === "preview" && <PreviewView />}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <SideSelector />
          </div>
        </div>
        {panelOpen && view === "edit" && (
          <RightPanel onClose={() => setPanelOpen(false)} />
        )}
      </div>
      <BottomBar />
    </div>
  );
}
