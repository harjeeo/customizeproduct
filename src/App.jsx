import { useState } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Canvas from "./components/Canvas/Canvas";
import RightPanel from "./components/RightPanel/RightPanel";
import SideSelector from "./components/SideSelector/SideSelector";
import BottomBar from "./components/BottomBar/BottomBar";

function App() {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      <Toolbar panelOpen={panelOpen} onTogglePanel={() => setPanelOpen((v) => !v)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Canvas />
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <SideSelector />
          </div>
        </div>
        {panelOpen && <RightPanel onClose={() => setPanelOpen(false)} />}
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
