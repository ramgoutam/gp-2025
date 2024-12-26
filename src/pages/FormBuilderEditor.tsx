import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormComponent, FormTemplate } from "@/types/formBuilder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";

export const FormBuilderEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const availableComponents = [
    { type: 'input', label: 'Text Input' },
    { type: 'textarea', label: 'Text Area' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio Group' },
    { type: 'select', label: 'Select' },
    { type: 'email', label: 'Email Input' },
    { type: 'phone', label: 'Phone Input' },
    { type: 'number', label: 'Number Input' },
    { type: 'date', label: 'Date Picker' },
    { type: 'file', label: 'File Upload' },
    { type: 'toggle', label: 'Toggle Switch' },
  ];

  const addComponent = (type: string, label: string) => {
    const newComponent: FormComponent = {
      id: uuidv4(),
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };
    setComponents([...components, newComponent]);
    toast({
      title: "Component Added",
      description: `${label} has been added to your form`,
    });
  };

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
            <p className="text-muted-foreground">Design your form layout</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {availableComponents.map((component) => (
                <DropdownMenuItem
                  key={component.type}
                  onClick={() => addComponent(component.type, component.label)}
                >
                  {component.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleSaveForm} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <FormBuilderCanvas
            components={components}
            onSelectComponent={() => {}}
            onUpdateComponents={setComponents}
          />
        </div>
      </div>
    </div>
  );
};