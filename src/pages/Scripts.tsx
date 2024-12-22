import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LabScriptForm } from "@/components/LabScriptForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LabScript } from "@/components/patient/LabScriptsTab";
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

  const loadScripts = () => {
    console.log("Loading scripts in Scripts page");
    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      try {
        const parsedScripts = JSON.parse(savedScripts) as LabScript[];
        console.log("Parsed scripts:", parsedScripts);
        
        // Create a Map to store unique scripts by ID
        const uniqueScriptsMap = new Map<string, LabScript>();
        parsedScripts.forEach(script => {
          if (!uniqueScriptsMap.has(script.id)) {
            uniqueScriptsMap.set(script.id, script);
          }
        });
        
        const uniqueScripts = Array.from(uniqueScriptsMap.values());
        console.log("Loaded unique scripts:", uniqueScripts);
        setLabScripts(uniqueScripts);
      } catch (error) {
        console.error("Error loading scripts:", error);
        setLabScripts([]);
      }
    } else {
      setLabScripts([]);
    }
  };

  useEffect(() => {
    loadScripts();
  }, []);

  const handleNewScriptSubmit = (formData: any) => {
    console.log("Creating new lab script:", formData);
    const newScript: LabScript = {
      ...formData,
      id: Date.now().toString(),
      status: "pending",
      treatments: {
        upper: formData.upperTreatment !== "None" ? [formData.upperTreatment] : [],
        lower: formData.lowerTreatment !== "None" ? [formData.lowerTreatment] : []
      }
    };

    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    console.log("Existing scripts before adding new:", existingScripts);
    
    // Create a Map to ensure uniqueness
    const scriptsMap = new Map<string, LabScript>();
    existingScripts.forEach(script => {
      scriptsMap.set(script.id, script);
    });
    scriptsMap.set(newScript.id, newScript);
    
    const updatedScripts = Array.from(scriptsMap.values());
    console.log("Updated scripts after adding new:", updatedScripts);
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    setShowNewScriptDialog(false);

    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created.",
    });
  };

  const handleScriptEdit = (updatedScript: LabScript) => {
    console.log("Editing script:", updatedScript);
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    console.log("Existing scripts before edit:", existingScripts);
    
    // Create a Map to ensure uniqueness
    const scriptsMap = new Map<string, LabScript>();
    existingScripts.forEach(script => {
      if (script.id === updatedScript.id) {
        scriptsMap.set(script.id, updatedScript);
      } else {
        scriptsMap.set(script.id, script);
      }
    });
    
    const updatedScripts = Array.from(scriptsMap.values());
    console.log("Updated scripts after edit:", updatedScripts);
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    setSelectedScript(null);
    setIsEditing(false);

    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  const handleScriptDelete = (scriptToDelete: LabScript) => {
    console.log("Deleting script:", scriptToDelete);
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]') as LabScript[];
    const updatedScripts = existingScripts.filter((script: LabScript) => script.id !== scriptToDelete.id);
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);

    toast({
      title: "Lab Script Deleted",
      description: "The lab script has been successfully deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
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
    </div>
  );
};

export default Scripts;