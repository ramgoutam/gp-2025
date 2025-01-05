import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Inventory from "./pages/Inventory";
import InventoryItems from "./pages/inventory/InventoryItems";
import Stock from "./pages/inventory/Stock";
import StockMovements from "./pages/inventory/StockMovements";
import PurchaseOrders from "./pages/inventory/PurchaseOrders";
import PurchaseOrderDetails from "./pages/inventory/PurchaseOrderDetails";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/items" element={<InventoryItems />} />
            <Route path="/inventory/stock" element={<Stock />} />
            <Route path="/inventory/movements" element={<StockMovements />} />
            <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/inventory/purchase-orders/:id" element={<PurchaseOrderDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
