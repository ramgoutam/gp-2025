import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Scripts from "@/pages/Scripts";
import Reports from "@/pages/Reports";
import Manufacturing from "@/pages/Manufacturing";
import Calendar from "@/pages/Calendar";
import Marketing from "@/pages/Marketing";
import Leads from "@/pages/Leads";
import Consultations from "@/pages/Consultations";
import PatientProfile from "@/pages/PatientProfile";
import FormBuilder from "@/pages/FormBuilder";
import FormBuilderEditor from "@/pages/FormBuilderEditor";
import Login from "@/pages/Login";
import Inventory from "@/pages/Inventory";
import InventoryItems from "@/pages/inventory/InventoryItems";
import StockManagement from "@/pages/inventory/StockManagement";
import StockMovements from "@/pages/inventory/StockMovements";
import PurchaseOrders from "@/pages/inventory/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/inventory/CreatePurchaseOrder";
import EditPurchaseOrder from "@/pages/inventory/EditPurchaseOrder";
import PurchaseOrderDetails from "@/pages/inventory/PurchaseOrderDetails";
import Suppliers from "@/pages/inventory/Suppliers";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/manufacturing" element={<Manufacturing />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/patient/:id" element={<PatientProfile />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/form-builder/:id" element={<FormBuilderEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/items" element={<InventoryItems />} />
        <Route path="/inventory/stock" element={<StockManagement />} />
        <Route path="/inventory/movements" element={<StockMovements />} />
        <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/inventory/purchase-orders/new" element={<CreatePurchaseOrder />} />
        <Route path="/inventory/purchase-orders/:id" element={<PurchaseOrderDetails />} />
        <Route path="/inventory/purchase-orders/:id/edit" element={<EditPurchaseOrder />} />
        <Route path="/inventory/suppliers" element={<Suppliers />} />
      </Routes>
    </Router>
  );
}

export default App;