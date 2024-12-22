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

  // Load scripts from localStorage when component mounts
  const loadScripts = () => {
    console.log("Loading scripts from localStorage");
    const savedScripts = localStorage.getItem('labScripts');
    if (savedScripts) {
      const scripts = JSON.parse(savedScripts);
      console.log("Loaded scripts:", scripts);
      setLabScripts(scripts);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('labScriptsUpdated'));
    }
  };

  useEffect(() => {
    loadScripts();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadScripts();
    };

    // Listen for both storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('labScriptsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('labScriptsUpdated', handleStorageChange);
    };
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

    // Update localStorage and state
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    const updatedScripts = [...existingScripts, newScript];
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    setShowNewScriptDialog(false);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('labScriptsUpdated'));

    toast({
      title: "Lab Script Created",
      description: "The lab script has been successfully created.",
    });
  };

  const handleEditScript = (updatedScript: LabScript) => {
    console.log("Editing script:", updatedScript);
    const existingScripts = JSON.parse(localStorage.getItem('labScripts') || '[]');
    const updatedScripts = existingScripts.map((script: LabScript) => 
      script.id === updatedScript.id ? updatedScript : script
    );
    
    localStorage.setItem('labScripts', JSON.stringify(updatedScripts));
    setLabScripts(updatedScripts);
    setSelectedScript(null);
    setIsEditing(false);

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('labScriptsUpdated'));

    toast({
      title: "Lab Script Updated",
      description: "The lab script has been successfully updated.",
    });
  };

  const handleRowClick = (script: LabScript) => {
    console.log("Row clicked, script:", script);
    setSelectedScript(script);
    setIsEditing(false);
  };

  const handleEditClick = (script: LabScript) => {
    console.log("Edit clicked, script:", script);
    setSelectedScript(script);
    setIsEditing(true);
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
              onRowClick={handleRowClick}
              onEditClick={handleEditClick}
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
          onEdit={handleEditScript}
          isEditing={isEditing}
        />
      </main>
    </div>
  );
};

export default Scripts;