import ProductPicker from "./components/ProductPicker/ProductPicker";
import Editor from "./components/Editor/Editor";
import { useProductStore } from "./store/productStore";

function App() {
  const product = useProductStore((s) => s.product);
  return product ? <Editor /> : <ProductPicker />;
}

export default App;
