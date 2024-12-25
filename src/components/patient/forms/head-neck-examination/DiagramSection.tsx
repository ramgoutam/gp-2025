import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DiagramSectionProps {
  type: "mallampati" | "malocclusion" | "inflammation";
  value: string;
  onChange: (value: string) => void;
}

export const DiagramSection = ({ type, value, onChange }: DiagramSectionProps) => {
  console.log(`Rendering ${type} diagram with value:`, value);
  
  const diagrams = {
    mallampati: [
      {
        src: "/lovable-uploads/mallampati-1.png",
        alt: "Mallampati Score Class I",
        value: "class_1",
        description: "Soft palate, uvula, fauces, pillars visible"
      },
      {
        src: "/lovable-uploads/mallampati-2.png",
        alt: "Mallampati Score Class II",
        value: "class_2",
        description: "Soft palate, uvula, fauces visible"
      },
      {
        src: "/lovable-uploads/mallampati-3.png",
        alt: "Mallampati Score Class III",
        value: "class_3",
        description: "Soft palate, base of uvula visible"
      },
      {
        src: "/lovable-uploads/mallampati-4.png",
        alt: "Mallampati Score Class IV",
        value: "class_4",
        description: "Only hard palate visible"
      }
    ],
    malocclusion: [
      {
        src: "/lovable-uploads/malocclusion-normal.png",
        alt: "Normal Bite",
        value: "normal",
        description: "Normal occlusion"
      },
      {
        src: "/lovable-uploads/malocclusion-cross.png",
        alt: "Cross Bite",
        value: "cross_bite",
        description: "Cross bite"
      },
      {
        src: "/lovable-uploads/malocclusion-open.png",
        alt: "Open Bite",
        value: "open_bite",
        description: "Open bite"
      },
      {
        src: "/lovable-uploads/malocclusion-deep.png",
        alt: "Deep Bite",
        value: "deep_bite",
        description: "Deep bite"
      }
    ],
    inflammation: [
      {
        src: "/lovable-uploads/inflammation-mild.png",
        alt: "Mild Inflammation",
        value: "mild",
        description: "Mild inflammation"
      },
      {
        src: "/lovable-uploads/inflammation-moderate.png",
        alt: "Moderate Inflammation",
        value: "moderate",
        description: "Moderate inflammation"
      },
      {
        src: "/lovable-uploads/inflammation-severe.png",
        alt: "Severe Inflammation",
        value: "severe",
        description: "Severe inflammation"
      }
    ]
  };

  const title = {
    mallampati: "Mallampati Classification",
    malocclusion: "Malocclusion Type",
    inflammation: "Inflammation Status"
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">{title[type]}</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {diagrams[type].map((diagram) => (
          <div
            key={diagram.value}
            className={cn(
              "relative cursor-pointer border-2 rounded-lg p-2 transition-all hover:shadow-md",
              value === diagram.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onChange(diagram.value)}
          >
            <div className="aspect-square relative mb-2">
              <img
                src={diagram.src}
                alt={diagram.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(`Error loading image: ${diagram.src}`);
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="text-xs text-center">
              <div className="font-medium">{diagram.alt}</div>
              <div className="text-gray-500">{diagram.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};