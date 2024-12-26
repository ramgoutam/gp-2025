import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { ComponentPalette } from "@/components/form-builder/ComponentPalette";
import { StyleControls } from "@/components/form-builder/StyleControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const FormBuilder = () => {
  const { toast } = useToast();
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  const handleSaveForm = async () => {
    try {
      const { error } = await supabase.from('form_templates').insert({
        name: formName,
        description: formDescription,
        config: { components }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Form template saved successfully",
      });
    } catch (error) {
      console.error('Error saving form template:', error);
      toast({
        title: "Error",
        description: "Failed to save form template",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">Create and customize your forms</p>
        </div>
        <Button onClick={handleSaveForm}>Save Form</Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formDescription">Description</Label>
            <Input
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter form description"
            />
          </div>
          <ComponentPalette onAddComponent={(component) => setComponents([...components, component])} />
        </div>

        <div className="col-span-6">
          <FormBuilderCanvas
            components={components}
            onSelectComponent={setSelectedComponent}
            onUpdateComponents={setComponents}
          />
        </div>

        <div className="col-span-3">
          <StyleControls
            selectedComponent={selectedComponent}
            onUpdateComponent={(updatedComponent) => {
              const newComponents = components.map(c =>
                c.id === updatedComponent.id ? updatedComponent : c
              );
              setComponents(newComponents);
            }}
          />
        </div>
      </div>
    </div>
  );
};