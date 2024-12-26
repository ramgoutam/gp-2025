import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  TextIcon, 
  CheckSquare, 
  Phone, 
  Mail, 
  Hash, 
  AlignLeft,
  CalendarIcon,
  ListIcon,
  CreditCardIcon,
  RadioIcon,
  SelectIcon,
  FileIcon,
  ToggleLeftIcon
} from "lucide-react";

const componentTypes = [
  { type: 'input', label: 'Text Input', icon: <TextIcon className="w-4 h-4" /> },
  { type: 'textarea', label: 'Text Block', icon: <AlignLeft className="w-4 h-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone Input', icon: <Phone className="w-4 h-4" /> },
  { type: 'email', label: 'Email Input', icon: <Mail className="w-4 h-4" /> },
  { type: 'number', label: 'Number Input', icon: <Hash className="w-4 h-4" /> },
  { type: 'date', label: 'Date Picker', icon: <CalendarIcon className="w-4 h-4" /> },
  { type: 'select', label: 'Dropdown', icon: <SelectIcon className="w-4 h-4" /> },
  { type: 'radio', label: 'Radio Group', icon: <RadioIcon className="w-4 h-4" /> },
  { type: 'file', label: 'File Upload', icon: <FileIcon className="w-4 h-4" /> },
  { type: 'toggle', label: 'Toggle Switch', icon: <ToggleLeftIcon className="w-4 h-4" /> },
  { type: 'card', label: 'Card Input', icon: <CreditCardIcon className="w-4 h-4" /> },
];

interface ComponentPaletteProps {
  onAddComponent: (component: any) => void;
}

export const ComponentPalette = ({ onAddComponent }: ComponentPaletteProps) => {
  const handleAddComponent = (type: string) => {
    const newComponent = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type}`,
      placeholder: `Enter ${type}`,
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      style: {
        width: '100%',
        marginBottom: '1rem',
      },
    };
    onAddComponent(newComponent);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold">Form Components</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 p-4">
        {componentTypes.map((component) => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start hover:bg-primary/10"
            onClick={() => handleAddComponent(component.type)}
          >
            <span className="mr-2">{component.icon}</span>
            {component.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};