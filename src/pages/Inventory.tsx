import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Warehouse, ClipboardList, TrendingUp, Users, FileSpreadsheet } from "lucide-react";
const Inventory = () => {
  const navigate = useNavigate();
  const modules = [{
    title: "Inventory Items",
    description: "Manage your inventory master list",
    icon: Package2,
    path: "/inventory/items"
  }, {
    title: "Stock Management",
    description: "Track stock levels across locations",
    icon: Warehouse,
    path: "/inventory/stock"
  }, {
    title: "Purchase Orders",
    description: "Create and manage purchase orders",
    icon: ClipboardList,
    path: "/inventory/purchase-orders"
  }, {
    title: "Stock Movement",
    description: "Track inventory movements and history",
    icon: TrendingUp,
    path: "/inventory/movements"
  }, {
    title: "Suppliers",
    description: "Manage your suppliers",
    icon: Users,
    path: "/inventory/suppliers"
  }, {
    title: "Post-Surgery Inventory Tracking Sheet",
    description: "Track and manage post-surgery inventory items",
    icon: FileSpreadsheet,
    path: "/inventory/post-surgery-tracking"
  }];
  return <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your inventory, track stock levels, and handle purchase orders
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(module => <Card key={module.path} className="hover:shadow-lg transition-shadow cursor-pointer bg-white" onClick={() => navigate(module.path)}>
              <CardHeader className="space-y-0 pb-2 rounded-none px-[19px] py-[6px]">
                <CardTitle className="font-medium flex items-center gap-2 px-0 text-base">
                  <module.icon className="h-5 w-5 text-primary" />
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 px-0">{module.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
};
export default Inventory;