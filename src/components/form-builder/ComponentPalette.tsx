import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  TextIcon, 
  CheckSquare, 
  Phone, 
  Mail, 
  Hash, 
  AlignLeft 
} from "lucide-react";

const componentTypes = [
  { type: 'input', label: 'Text Input', icon: <TextIcon className="w-4 h-4" /> },
  { type: 'textarea', label: 'Text Block', icon: <AlignLeft className="w-4 h-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone Input', icon: <Phone className="w-4 h-4" /> },
  { type: 'email', label: 'Email Input', icon: <Mail className="w-4 h-4" /> },
  { type: 'number', label: 'Number Input', icon: <Hash className="w-4 h-4" /> },
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
      style: {
        width: '100%',
        marginBottom: '1rem',
      },
    };
    onAddComponent(newComponent);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {componentTypes.map((component) => (
          <Button
            key={component.type}
            variant="outline"
            className="w-full justify-start"
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