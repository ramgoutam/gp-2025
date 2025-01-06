import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { SuppliersTable } from "@/components/inventory/SuppliersTable";
import { AddSupplierDialog } from "@/components/inventory/AddSupplierDialog";

export default function Suppliers() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/inventory")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Suppliers</h1>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <SuppliersTable />
        </div>

        <AddSupplierDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      </div>
    </div>
  </div>