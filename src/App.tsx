import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryItems from "@/pages/inventory/InventoryItems";
import Home from "@/pages/Home"; // Example of an existing route
import About from "@/pages/About"; // Example of an existing route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/inventory/items" element={<InventoryItems />} />
      </Routes>
    </Router>
  );
}

export default App;
