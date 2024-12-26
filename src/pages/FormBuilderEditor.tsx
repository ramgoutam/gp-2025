import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { FormBuilderToolbar } from "@/components/form-builder/FormBuilderToolbar";
import { supabase } from "@/integrations/supabase/client";
import { FormComponent, FormTemplate } from "@/types/formBuilder";
import { v4 as uuidv4 } from "uuid";

export const FormBuilderEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [components, setComponents] = useState<FormComponent[]>([]);
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

  const addComponent = (type: string, label: string) => {
    const newComponent: FormComponent = {
      id: uuidv4(),
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: false,
      children: type.startsWith('popup-') ? [] : undefined,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      style: type === 'popup-custom' ? { width: '800px' } : undefined
    };
    
    setComponents([...components, newComponent]);
    toast({
      title: "Component Added",
      description: `${label} has been added to your form`,
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
      <FormBuilderToolbar
        onNavigateBack={() => navigate('/form-builder')}
        onSave={handleSaveForm}
        onAddComponent={addComponent}
      />
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