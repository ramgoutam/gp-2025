import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";

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
    switch (component.type) {
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.placeholder}
            className="w-full p-2 border rounded"
            style={component.style}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={component.placeholder}
            className="w-full p-2 border rounded"
            style={component.style}
          />
        );
      // Add more component types as needed
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