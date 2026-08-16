import tshirtFront from "./tshirt-front.svg";
import tshirtBack from "./tshirt-back.svg";

// Print area box is defined in % of the mockup canvas (viewBox 620x700),
// plus its real-world size in inches so the right panel can show W/H in inches.
export const tshirt = {
  id: "tshirt",
  name: "T-Shirt",
  canvas: { width: 620, height: 700 },
  sides: [
    {
      id: "front",
      label: "Front side",
      mockup: tshirtFront,
      printArea: {
        xPct: 25,
        yPct: 32.14,
        widthPct: 50,
        heightPct: 62.14,
        widthIn: 12,
        heightIn: 16,
      },
    },
    {
      id: "back",
      label: "Back side",
      mockup: tshirtBack,
      printArea: {
        xPct: 25,
        yPct: 30,
        widthPct: 50,
        heightPct: 64.3,
        widthIn: 12,
        heightIn: 16,
      },
    },
  ],
};
