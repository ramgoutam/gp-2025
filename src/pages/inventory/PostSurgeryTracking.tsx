
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";

const PostSurgeryTracking = () => {
  return (
    <main className="container mx-auto h-[calc(100vh-4rem)] overflow-hidden px-0">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Post-Surgery Inventory Tracking</h1>
            <p className="text-sm text-gray-500">Track and manage post-surgery inventory items</p>
          </div>
        </div>
        <Button variant="outline" className="aspect-square max-sm:p-0">
          <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
          <span className="max-sm:sr-only">Add new</span>
        </Button>
      </div>
      
      <Card className="p-6">
        <p>Ready for your guidance on what to add here!</p>
      </Card>
    </main>
  );
};

export default PostSurgeryTracking;
