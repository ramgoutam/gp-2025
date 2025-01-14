import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import PurchaseOrders from "@/pages/inventory/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/inventory/CreatePurchaseOrder";
import PurchaseOrderDetails from "@/pages/inventory/PurchaseOrderDetails";
import InventoryItems from "@/pages/inventory/InventoryItems";
import StockManagement from "@/pages/inventory/StockManagement";
import Suppliers from "@/pages/inventory/Suppliers";
import StockMovements from "@/pages/inventory/StockMovements";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Navigation>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/inventory/purchase-orders/create" element={<CreatePurchaseOrder />} />
          <Route path="/inventory/purchase-orders/:id" element={<PurchaseOrderDetails />} />
          <Route path="/inventory/items" element={<InventoryItems />} />
          <Route path="/inventory/stock" element={<StockManagement />} />
          <Route path="/inventory/suppliers" element={<Suppliers />} />
          <Route path="/inventory/movements" element={<StockMovements />} />
        </Routes>
      </Navigation>
      <Toaster />
    </Router>
  );
}

export default App;