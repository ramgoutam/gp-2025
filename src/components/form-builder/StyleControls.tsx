import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface StyleControlsProps {
  selectedComponent: any;
  onUpdateComponent: (component: any) => void;
}

export const StyleControls = ({
  selectedComponent,
  onUpdateComponent,
}: StyleControlsProps) => {
  if (!selectedComponent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Style Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a component to edit its properties</p>
        </CardContent>
      </Card>
    );
  }

  const handleStyleChange = (property: string, value: string) => {
    onUpdateComponent({
      ...selectedComponent,
      style: {
        ...selectedComponent.style,
        [property]: value,
      },
    });
  };

  const handleLabelChange = (value: string) => {
    onUpdateComponent({
      ...selectedComponent,
      label: value,
    });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdateComponent({
      ...selectedComponent,
      required: checked,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={selectedComponent.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            value={selectedComponent.style.width}
            onChange={(e) => handleStyleChange('width', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Margin Bottom</Label>
          <Input
            value={selectedComponent.style.marginBottom}
            onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={selectedComponent.required}
            onCheckedChange={handleRequiredChange}
          />
          <Label>Required</Label>
        </div>
      </CardContent>
    </Card>
  );
};