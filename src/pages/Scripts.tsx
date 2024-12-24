import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptList } from "@/components/patient/LabScriptList";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";

const Scripts = () => {
  const [showNewScriptDialog, setShowNewScriptDialog] = useState(false);
  const [labScripts, setLabScripts] = useState<LabScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleNewScriptSubmit = (formData: LabScript) => {
    try {
      console.log("Creating new lab script:", formData);
      const newScript = {
        ...formData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setLabScripts(prev => [newScript, ...prev]);
      setShowNewScriptDialog(false);

      toast({
        title: "Lab Script Created",
        description: "The lab script has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to create lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScriptEdit = (updatedScript: LabScript) => {
    try {
      console.log("Editing script:", updatedScript);
      setLabScripts(prev => 
        prev.map(script => 
          script.id === updatedScript.id ? updatedScript : script
        )
      );
      setSelectedScript(null);
      setIsEditing(false);

      toast({
        title: "Lab Script Updated",
        description: "The lab script has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to update lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScriptDelete = (scriptToDelete: LabScript) => {
    try {
      console.log("Deleting script:", scriptToDelete);
      setLabScripts(prev => prev.filter(script => script.id !== scriptToDelete.id));

      toast({
        title: "Lab Script Deleted",
        description: "The lab script has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting lab script:", error);
      toast({
        title: "Error",
        description: "Failed to delete lab script. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lab Scripts</h1>
        <Button 
          onClick={() => setShowNewScriptDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Script
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <ScrollArea className="h-[500px]">
          <LabScriptList 
            labScripts={labScripts}
            onRowClick={(script) => {
              setSelectedScript(script);
              setIsEditing(false);
            }}
            onEditClick={(script) => {
              setSelectedScript(script);
              setIsEditing(true);
            }}
            onDeleteClick={handleScriptDelete}
          />
        </ScrollArea>
      </div>

      <Dialog 
        open={showNewScriptDialog} 
        onOpenChange={setShowNewScriptDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lab Script</DialogTitle>
          </DialogHeader>
          <LabScriptForm onSubmit={handleNewScriptSubmit} />
        </DialogContent>
      </Dialog>

      <LabScriptDetails
        script={selectedScript}
        open={!!selectedScript}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedScript(null);
            setIsEditing(false);
          }
        }}
        onEdit={handleScriptEdit}
        isEditing={isEditing}
      />
    </main>
  );
};

export default Scripts;