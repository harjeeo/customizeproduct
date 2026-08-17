import {
  TShirtIcon,
  HoodieIcon,
  Coffee01Icon,
  Image01Icon,
  BedIcon,
  MedicineBottle01Icon,
  Notebook01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { tshirt } from "./tshirt/config";
import { phonecase } from "./phonecase/config";

// Every product the catalog can show. "config" is only present once a
// product's editor config has actually been built — everything else shows
// as a disabled "coming soon" card until its turn comes up.
export const productRegistry = [
  { id: "tshirt", name: "T-Shirt", icon: TShirtIcon, config: tshirt },
  { id: "phonecase", name: "Phone Case", icon: SmartPhone01Icon, config: phonecase },
  { id: "hoodie", name: "Hoodie", icon: HoodieIcon, config: null },
  { id: "mug", name: "Mug", icon: Coffee01Icon, config: null },
  { id: "wallart", name: "Wall Art", icon: Image01Icon, config: null },
  { id: "pillow", name: "Pillow", icon: BedIcon, config: null },
  { id: "bottle", name: "Bottle", icon: MedicineBottle01Icon, config: null },
  { id: "notebook", name: "Notebook", icon: Notebook01Icon, config: null },
];

export const getProductConfig = (id) =>
  productRegistry.find((p) => p.id === id)?.config ?? null;
