import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormComponent } from "@/types/formBuilder";

interface FormBuilderCanvasProps {
  components: FormComponent[];
  onSelectComponent: (component: FormComponent) => void;
  onUpdateComponents: (components: FormComponent[]) => void;
}

export const FormBuilderCanvas = ({
  components,
  onSelectComponent,
  onUpdateComponents,
}: FormBuilderCanvasProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateComponents(items);
  };

  const renderComponent = (component: any) => {
    const commonProps = {
      placeholder: component.placeholder,
      className: cn("w-full", component.style?.width && `w-[${component.style.width}]`),
      style: component.style,
    };

    switch (component.type) {
      case 'input':
        return <Input type="text" {...commonProps} />;
      case 'textarea':
        return <Textarea {...commonProps} />;
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={component.id} />
            <Label htmlFor={component.id}>{component.placeholder}</Label>
          </div>
        );
      case 'phone':
        return <Input type="tel" {...commonProps} />;
      case 'email':
        return <Input type="email" {...commonProps} />;
      case 'number':
        return <Input type="number" {...commonProps} />;
      case 'date':
        return <Calendar className="rounded-md border" />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={component.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {component.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option.toLowerCase()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup className="flex flex-col space-y-2">
            {component.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase()} id={`${component.id}-${index}`} />
                <Label htmlFor={`${component.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'file':
        return (
          <Input
            type="file"
            className="cursor-pointer"
            {...commonProps}
          />
        );
      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch id={component.id} />
            <Label htmlFor={component.id}>{component.placeholder}</Label>
          </div>
        );
      case 'card':
        return <Input type="text" pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}" placeholder="Card number" {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 min-h-[600px] bg-white shadow-md">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-canvas">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {components.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => onSelectComponent(component)}
                      className="border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white shadow-sm"
                    >
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        {component.label}
                        {component.required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      {renderComponent(component)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {components.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Drag and drop components here to build your form
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
};