import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormComponent } from "@/types/formBuilder";
import { FormBuilderCanvasContent } from "./FormBuilderCanvasContent";

interface PopupComponentProps {
  component: FormComponent;
  onUpdateComponents?: (components: FormComponent[]) => void;
  isPreview?: boolean;
}

export const PopupComponent = ({ component, onUpdateComponents, isPreview = false }: PopupComponentProps) => {
  const getMaxWidth = () => {
    if (component.style?.width) return component.style.width;
    
    switch (component.type) {
      case 'popup-sm': return 'max-w-sm';
      case 'popup-md': return 'max-w-md';
      case 'popup-lg': return 'max-w-lg';
      case 'popup-xl': return 'max-w-xl';
      case 'popup-2xl': return 'max-w-2xl';
      case 'popup-3xl': return 'max-w-3xl';
      case 'popup-4xl': return 'max-w-4xl';
      case 'popup-5xl': return 'max-w-5xl';
      case 'popup-6xl': return 'max-w-6xl';
      case 'popup-7xl': return 'max-w-7xl';
      case 'popup-custom': return component.style?.width || 'max-w-md';
      default: return 'max-w-md';
    }
  };

  return (
    <Dialog>
      <DialogContent className={`${getMaxWidth()} bg-white max-h-[90vh] overflow-hidden`}>
        <DialogHeader>
          <DialogTitle>{component.label}</DialogTitle>
          {component.placeholder && (
            <DialogDescription>
              {component.placeholder}
            </DialogDescription>
          )}
        </DialogHeader>
        {component.children && component.children.length > 0 && (
          <div className="flex-1 overflow-auto">
            <FormBuilderCanvasContent
              components={component.children}
              onUpdateComponents={onUpdateComponents}
              isNested={true}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};