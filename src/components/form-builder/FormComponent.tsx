import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FormComponent as FormComponentType } from "@/types/formBuilder";
import { PopupComponent } from "./PopupComponent";

interface FormComponentProps {
  component: FormComponentType;
}

export const FormComponentRenderer = ({ component }: FormComponentProps) => {
  const commonProps = {
    placeholder: component.placeholder,
    className: cn(
      "w-full",
      component.style?.textAlign && `text-${component.style.textAlign}`,
      component.style?.fontSize
    ),
    style: component.style,
  };

  switch (component.type) {
    case 'h1':
      return <h1 className="text-4xl font-bold mb-4" style={component.style}>{component.placeholder}</h1>;
    case 'h2':
      return <h2 className="text-2xl font-semibold mb-3" style={component.style}>{component.placeholder}</h2>;
    case 'paragraph':
      return <p className="text-gray-600 mb-4" style={component.style}>{component.placeholder}</p>;
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
    case 'link':
      return (
        <a href="#" className="text-primary hover:underline" style={component.style}>
          {component.placeholder}
        </a>
      );
    default:
      if (component.type.startsWith('popup-')) {
        return <PopupComponent component={component} />;
      }
      return null;
  }
};