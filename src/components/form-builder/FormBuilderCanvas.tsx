import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormBuilderCanvasProps {
  components: any[];
  onSelectComponent: (component: any) => void;
  onUpdateComponents: (components: any[]) => void;
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
      className: "w-full",
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
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 min-h-[600px]">
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
                      className="border p-4 rounded cursor-pointer hover:border-primary"
                    >
                      <label className="block mb-2 text-sm font-medium">
                        {component.label}
                        {component.required && <span className="text-destructive ml-1">*</span>}
                      </label>
                      {renderComponent(component)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
};