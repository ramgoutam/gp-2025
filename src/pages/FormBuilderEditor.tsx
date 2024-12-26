import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormBuilderCanvas } from "@/components/form-builder/FormBuilderCanvas";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Plus, Heading1, Heading2, Type, 
  Link, ListTodo, MessageSquare, LogIn 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormComponent, FormTemplate } from "@/types/formBuilder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";

// Move component definitions to a separate component for better organization
const availableComponents = [
  // Text Components
  { type: 'h1', label: 'Heading 1', icon: Heading1, category: 'Text' },
  { type: 'h2', label: 'Heading 2', icon: Heading2, category: 'Text' },
  { type: 'paragraph', label: 'Paragraph', icon: Type, category: 'Text' },
  
  // Input Components
  { type: 'input', label: 'Text Input', icon: Type, category: 'Input' },
  { type: 'textarea', label: 'Text Area', icon: Type, category: 'Input' },
  { type: 'email', label: 'Email Input', icon: Type, category: 'Input' },
  { type: 'phone', label: 'Phone Input', icon: Type, category: 'Input' },
  { type: 'number', label: 'Number Input', icon: Type, category: 'Input' },
  { type: 'date', label: 'Date Picker', icon: Type, category: 'Input' },
  { type: 'file', label: 'File Upload', icon: Type, category: 'Input' },
  
  // Selection Components
  { type: 'checkbox', label: 'Checkbox', icon: ListTodo, category: 'Selection' },
  { type: 'radio', label: 'Radio Group', icon: ListTodo, category: 'Selection' },
  { type: 'select', label: 'Select Dropdown', icon: ListTodo, category: 'Selection' },
  { type: 'toggle', label: 'Toggle Switch', icon: ListTodo, category: 'Selection' },
  
  // Advanced Components
  { type: 'link', label: 'Link', icon: Link, category: 'Advanced' },
  { type: 'popup-sm', label: 'Small Popup', icon: MessageSquare, category: 'Advanced' },
  { type: 'popup-md', label: 'Medium Popup', icon: MessageSquare, category: 'Advanced' },
  { type: 'popup-lg', label: 'Large Popup', icon: MessageSquare, category: 'Advanced' },
  { type: 'conditional', label: 'Conditional Logic', icon: LogIn, category: 'Advanced' },
];

export const FormBuilderEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addComponent = (type: string, label: string) => {
    const newComponent: FormComponent = {
      id: uuidv4(),
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      style: {
        width: type.startsWith('popup') ? 
          (type === 'popup-sm' ? '300px' : type === 'popup-md' ? '500px' : '800px') : 
          '100%'
      }
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
              <Button variant="outline" size="icon" className="relative">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-64 bg-white shadow-lg border rounded-lg p-2"
              style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
              {['Text', 'Input', 'Selection', 'Advanced'].map((category) => (
                <div key={category} className="mb-2">
                  <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-2 py-1">
                    {category}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="bg-gray-50 rounded-md p-1">
                    {availableComponents
                      .filter(component => component.category === category)
                      .map((component) => (
                        <DropdownMenuItem
                          key={component.type}
                          onClick={() => addComponent(component.type, component.label)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        >
                          <component.icon className="mr-2 h-4 w-4 text-primary" />
                          <span className="text-sm">{component.label}</span>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-2" />
                </div>
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