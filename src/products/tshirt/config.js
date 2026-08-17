import tshirtFront from "./tshirt-front.svg";
import tshirtBack from "./tshirt-back.svg";

// Print area box is defined in % of the mockup canvas (source viewBox 0 0 1000 1000),
// plus its real-world size in inches so the right panel can show W/H in inches.
export const tshirt = {
  id: "tshirt",
  name: "T-Shirt",
  canvas: { width: 700, height: 700 },
  sides: [
    {
      id: "front",
      label: "Front side",
      mockup: tshirtFront,
      printArea: {
        xPct: 34.916,
        yPct: 28.327,
        widthPct: 30.168,
        heightPct: 40.565,
        widthIn: 12,
        heightIn: 16,
      },
    },
    {
      id: "back",
      label: "Back side",
      mockup: tshirtBack,
      printArea: {
        xPct: 35.132,
        yPct: 28.327,
        widthPct: 30.168,
        heightPct: 40.565,
        widthIn: 12,
        heightIn: 16,
      },
    },
  ],
};
