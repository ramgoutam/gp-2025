import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import PatientDetails from "@/pages/PatientDetails";
import LabScripts from "@/pages/LabScripts";
import CreateLabScript from "@/pages/CreateLabScript";
import EditLabScript from "@/pages/EditLabScript";
import LabScriptDetails from "@/pages/LabScriptDetails";
import Manufacturing from "@/pages/Manufacturing";
import Inventory from "@/pages/Inventory";
import PurchaseOrders from "@/pages/inventory/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/inventory/CreatePurchaseOrder";
import PurchaseOrderDetails from "@/pages/inventory/PurchaseOrderDetails";
import InventoryItems from "@/pages/inventory/InventoryItems";
import StockManagement from "@/pages/inventory/StockManagement";
import Suppliers from "@/pages/inventory/Suppliers";
import StockMovements from "@/pages/inventory/StockMovements";
import ReportCards from "@/pages/ReportCards";
import ReportCardDetails from "@/pages/ReportCardDetails";
import Settings from "@/pages/Settings";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Navigation>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/lab-scripts" element={<LabScripts />} />
          <Route path="/lab-scripts/create" element={<CreateLabScript />} />
          <Route path="/lab-scripts/:id/edit" element={<EditLabScript />} />
          <Route path="/lab-scripts/:id" element={<LabScriptDetails />} />
          <Route path="/manufacturing" element={<Manufacturing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/inventory/purchase-orders/create" element={<CreatePurchaseOrder />} />
          <Route path="/inventory/purchase-orders/:id" element={<PurchaseOrderDetails />} />
          <Route path="/inventory/items" element={<InventoryItems />} />
          <Route path="/inventory/stock" element={<StockManagement />} />
          <Route path="/inventory/suppliers" element={<Suppliers />} />
          <Route path="/inventory/movements" element={<StockMovements />} />
          <Route path="/report-cards" element={<ReportCards />} />
          <Route path="/report-cards/:id" element={<ReportCardDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Navigation>
      <Toaster />
    </Router>
  );
}

export default App;