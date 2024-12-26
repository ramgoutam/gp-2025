import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const componentTypes = [
  { type: 'input', label: 'Text Input', icon: '📝' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'select', label: 'Select', icon: '📋' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'radio', label: 'Radio Group', icon: '⭕' },
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