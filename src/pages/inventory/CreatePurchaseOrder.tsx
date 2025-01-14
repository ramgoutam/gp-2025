import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/inventory/purchase-orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
      </div>
      {/* Purchase order form will be implemented later */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Purchase order form will be added here</p>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;