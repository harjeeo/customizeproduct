import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Canvas from "./components/Canvas/Canvas";
import PreviewView from "./components/PreviewView/PreviewView";
import RightPanel from "./components/RightPanel/RightPanel";
import SideSelector from "./components/SideSelector/SideSelector";
import BottomBar from "./components/BottomBar/BottomBar";
import { useProductStore } from "./store/productStore";

function App() {
  const [panelOpen, setPanelOpen] = useState(true);
  const view = useProductStore((s) => s.view);

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      <Toolbar panelOpen={panelOpen} onTogglePanel={() => setPanelOpen((v) => !v)} />
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

export default App;
