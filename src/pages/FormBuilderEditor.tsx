import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { ComponentPalette } from "@/components/form-builder/ComponentPalette";
import { StyleControls } from "@/components/form-builder/StyleControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormComponent, FormTemplate } from "@/types/formBuilder";

export const FormBuilderEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFormTemplate();
    }
  }, [id]);

  const fetchFormTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('form_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const template = data as FormTemplate;
        setFormName(template.name);
        setFormDescription(template.description || '');
        setComponents(template.config.components || []);
      }
    } catch (error) {
      console.error('Error fetching form template:', error);
      toast({
        title: "Error",
        description: "Failed to load form template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForm = async () => {
    try {
      const { error } = await supabase
        .from('form_templates')
        .update({
          name: formName,
          description: formDescription,
          config: { components }
        })
        .eq('id', id);

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

  const handlePreview = () => {
    toast({
      title: "Coming Soon",
      description: "Form preview feature is under development",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/form-builder')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <p className="text-muted-foreground">Design your form layout and fields</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            Preview
          </Button>
          <Button onClick={handleSaveForm} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          <div className="space-y-4">
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
              <Textarea
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
                rows={3}
              />
            </div>
          </div>
          <ComponentPalette 
            onAddComponent={(component) => {
              setComponents([...components, component]);
              setSelectedComponent(component);
            }} 
          />
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