import React from "react";
import { Label } from "@/components/ui/label";

interface DiagramSectionProps {
  type: "mallampati" | "malocclusion" | "inflammation";
  value: string;
  onChange: (value: string) => void;
}

export const DiagramSection = ({ type, value, onChange }: DiagramSectionProps) => {
  const diagrams = {
    mallampati: [
      {
        src: "/lovable-uploads/mallampati-1.png",
        alt: "Mallampati Score Class I",
        value: "class_1"
      },
      {
        src: "/lovable-uploads/mallampati-2.png",
        alt: "Mallampati Score Class II",
        value: "class_2"
      },
      {
        src: "/lovable-uploads/mallampati-3.png",
        alt: "Mallampati Score Class III",
        value: "class_3"
      },
      {
        src: "/lovable-uploads/mallampati-4.png",
        alt: "Mallampati Score Class IV",
        value: "class_4"
      }
    ],
    malocclusion: [
      {
        src: "/lovable-uploads/malocclusion-1.png",
        alt: "Normal Bite",
        value: "normal"
      },
      {
        src: "/lovable-uploads/malocclusion-2.png",
        alt: "Cross Bite",
        value: "cross_bite"
      }
    ],
    inflammation: [
      {
        src: "/lovable-uploads/inflammation-mild.png",
        alt: "Mild Inflammation",
        value: "mild"
      },
      {
        src: "/lovable-uploads/inflammation-moderate.png",
        alt: "Moderate Inflammation",
        value: "moderate"
      },
      {
        src: "/lovable-uploads/inflammation-diffuse.png",
        alt: "Diffuse Inflammation",
        value: "diffuse"
      }
    ]
  };

  return (
    <div className="space-y-4">
      <Label>{type.charAt(0).toUpperCase() + type.slice(1)} Classification</Label>
      <div className="grid grid-cols-4 gap-4">
        {diagrams[type].map((diagram) => (
          <div
            key={diagram.value}
            className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all ${
              value === diagram.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onChange(diagram.value)}
          >
            <img
              src={diagram.src}
              alt={diagram.alt}
              className="w-full h-auto object-contain"
            />
            <div className="text-xs text-center mt-2">{diagram.alt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};