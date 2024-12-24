import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/components/patient/LabScriptsTab";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScriptList } from "@/components/patient/LabScriptList";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";
import { saveLabScript, updateLabScript, getLabScripts } from "@/utils/labScriptStorage";

const Scripts = () => {
  const [showNewScriptDialog, setShowNewScriptDialog] = useState(false);
  const [labScripts, setLabScripts] = useState<LabScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<LabScript | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const loadScripts = () => {
    console.log("Loading scripts in Scripts page");
    const scripts = getLabScripts();
    setLabScripts(scripts);
  };

  useEffect(() => {
    loadScripts();
  }, []);

  const handleNewScriptSubmit = (formData: any) => {
    console.log("Creating new lab script:", formData);
    const newScript: LabScript = {
      ...formData,
      id: Date.now().toString(),
      status: "pending"
    };

    const saved = saveLabScript(newScript);
    if (!saved) {
      toast({
        title: "Error",
        description: "A similar lab script already exists. Please check the details and try again.",
        variant: "destructive"
      });
      return;
    }

    loadScripts();
    setShowNewScriptDialog(false);

    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created.",
    });
  };

  const handleScriptEdit = (updatedScript: LabScript) => {
    console.log("Editing script:", updatedScript);
    updateLabScript(updatedScript);
    loadScripts();
    setSelectedScript(null);
    setIsEditing(false);

    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  const handleScriptDelete = (scriptToDelete: LabScript) => {
    console.log("Deleting script:", scriptToDelete);
    const existingScripts = getLabScripts();
    const updatedScripts = existingScripts.filter(script => script.id !== scriptToDelete.id);
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    loadScripts();

    toast({
      title: "Lab Script Deleted",
      description: "The lab script has been successfully deleted.",
    });
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