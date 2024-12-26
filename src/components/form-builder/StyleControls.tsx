import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      <Card className="bg-white shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold">Style Controls</CardTitle>
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

  const handlePlaceholderChange = (value: string) => {
    onUpdateComponent({
      ...selectedComponent,
      placeholder: value,
    });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdateComponent({
      ...selectedComponent,
      required: checked,
    });
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split('\n').filter(option => option.trim() !== '');
    onUpdateComponent({
      ...selectedComponent,
      options,
    });
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold">Style Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={selectedComponent.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>

        {!['checkbox', 'radio', 'toggle'].includes(selectedComponent.type) && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={selectedComponent.placeholder}
              onChange={(e) => handlePlaceholderChange(e.target.value)}
            />
          </div>
        )}

        {['select', 'radio'].includes(selectedComponent.type) && (
          <div className="space-y-2">
            <Label>Options (one per line)</Label>
            <Textarea
              value={selectedComponent.options?.join('\n') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Width</Label>
          <Select
            value={selectedComponent.style.width}
            onValueChange={(value) => handleStyleChange('width', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">Full Width</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Margin Bottom</Label>
          <Select
            value={selectedComponent.style.marginBottom}
            onValueChange={(value) => handleStyleChange('marginBottom', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select margin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5rem">Small</SelectItem>
              <SelectItem value="1rem">Medium</SelectItem>
              <SelectItem value="1.5rem">Large</SelectItem>
              <SelectItem value="2rem">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
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