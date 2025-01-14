import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const PurchaseOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track your purchase orders
            </p>
          </div>
          <Button onClick={() => navigate('/inventory/purchase-orders/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>

        <Card className="p-6">
          {/* Purchase orders table will be implemented in the next step */}
          <p className="text-sm text-gray-500">Purchase orders table coming soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrders;