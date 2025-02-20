
import { Route, Routes } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import InventoryItems from "./inventory/InventoryItems";
import StockManagement from "./inventory/StockManagement";
import StockMovements from "./inventory/StockMovements";
import PurchaseOrders from "./inventory/PurchaseOrders";
import CreatePurchaseOrder from "./inventory/CreatePurchaseOrder";
import PurchaseOrderDetails from "./inventory/PurchaseOrderDetails";
import Suppliers from "./inventory/Suppliers";
import PostSurgeryTracking from "./inventory/PostSurgeryTracking";

const Inventory = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto py-6">
      <Tabs value={location.pathname} className="w-full">
        <TabsList className="w-full justify-start mb-4 rounded-lg bg-white border shadow-sm h-auto p-2 gap-2">
          <Link to="/inventory">
            <TabsTrigger
              value="/inventory"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Inventory Items
            </TabsTrigger>
          </Link>
          <Link to="/inventory/stock">
            <TabsTrigger
              value="/inventory/stock"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Stock Management
            </TabsTrigger>
          </Link>
          <Link to="/inventory/movements">
            <TabsTrigger
              value="/inventory/movements"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Stock Movements
            </TabsTrigger>
          </Link>
          <Link to="/inventory/purchase-orders">
            <TabsTrigger
              value="/inventory/purchase-orders"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Purchase Orders
            </TabsTrigger>
          </Link>
          <Link to="/inventory/suppliers">
            <TabsTrigger
              value="/inventory/suppliers"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Suppliers
            </TabsTrigger>
          </Link>
          <Link to="/inventory/post-surgery">
            <TabsTrigger
              value="/inventory/post-surgery"
              className="data-[state=active]:bg-primary/5 rounded data-[state=active]:text-primary"
            >
              Post Surgery Tracking
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <Routes>
        <Route path="/" element={<InventoryItems />} />
        <Route path="/stock" element={<StockManagement />} />
        <Route path="/movements" element={<StockMovements />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
        <Route path="/purchase-orders/:id" element={<PurchaseOrderDetails />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/post-surgery" element={<PostSurgeryTracking />} />
      </Routes>
    </div>
  );
};

export default Inventory;
