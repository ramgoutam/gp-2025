import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";

const PurchaseOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button
          onClick={() => navigate("/inventory/purchase-orders/create")}
          className="flex items-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>
      {/* Purchase orders table will be implemented later */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Purchase orders will be displayed here</p>
      </div>
    </div>
  );
};

export default PurchaseOrders;