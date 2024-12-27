import { Printer, CircuitBoard, Factory, Cog, CheckCircle } from "lucide-react";
import { ManufacturingCard } from "@/components/manufacturing/ManufacturingCard";
import { ManufacturingHeader } from "@/components/manufacturing/ManufacturingHeader";
import { ManufacturingTable } from "@/components/manufacturing/ManufacturingTable";
import { useManufacturingData } from "@/components/manufacturing/useManufacturingData";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Manufacturing = () => {
  const { toast } = useToast();
  const { data: manufacturingData = {
    counts: {
      inhousePrinting: 0,
      inhouseMilling: 0,
      outsourcePrinting: 0,
      outsourceMilling: 0,
      total: 0,
      completedOutsourceMilling: 0
    },
    scripts: []
  }} = useManufacturingData();

  const handleStatusUpdate = async (script: LabScript, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status: newStatus })
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "The lab script status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update the status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (script: LabScript) => {
    console.log("Edit script:", script);
    // Implement edit functionality
  };

  const handleDelete = async (script: LabScript) => {
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .delete()
        .eq('id', script.id);

      if (error) throw error;

      toast({
        title: "Lab Script Deleted",
        description: "The lab script has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting lab script:", error);
      toast({
        title: "Error",
        description: "Failed to delete the lab script. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cards = [
    {
      title: "Inhouse Printing",
      count: manufacturingData.counts.inhousePrinting,
      icon: Printer,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'printing'
      )
    },
    {
      title: "Inhouse Milling",
      count: manufacturingData.counts.inhouseMilling,
      icon: CircuitBoard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progressColor: "bg-purple-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'inhouse' && s.manufacturingType === 'milling'
      )
    },
    {
      title: "Outsource Printing",
      count: manufacturingData.counts.outsourcePrinting,
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'printing'
      )
    },
    {
      title: "Outsource Milling",
      count: manufacturingData.counts.outsourceMilling,
      icon: Cog,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progressColor: "bg-green-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && s.manufacturingType === 'milling'
      )
    },
    {
      title: "Completed",
      count: manufacturingData.counts.completedOutsourceMilling,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      progressColor: "bg-emerald-500",
      scripts: manufacturingData.scripts.filter(s => 
        s.manufacturingSource === 'outsource' && 
        s.manufacturingType === 'milling' && 
        s.status === 'completed'
      )
    }
  ];

  // Filter scripts that have completed design info
  const manufacturingScripts = manufacturingData.scripts.filter(script => 
    script.designInfo && script.status !== 'completed'
  );

  return (
    <div className="container mx-auto p-8 space-y-6">
      <ManufacturingHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <ManufacturingCard
            key={card.title}
            {...card}
          />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Manufacturing Queue</h2>
        <ManufacturingTable
          scripts={manufacturingScripts}
          onStatusUpdate={handleStatusUpdate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Manufacturing;