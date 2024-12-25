import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FunctionalPresentationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FunctionalPresentationSection = ({
  formData,
  setFormData,
}: FunctionalPresentationSectionProps) => {
  const functionalItems = [
    {
      category: "FUNCTIONAL PRESENTATION",
      items: [
        { id: "vertical_overlap", label: "Vertical overlap of anterior teeth" },
        { id: "transverse_skeletal", label: "Transverse Skeletal Discrepancy" },
        { id: "supra_eruption", label: "Supra eruption of a dentoalveolar segment" },
        { id: "deep_overbite", label: "Deep overbite with impingement or irritation of soft tissue" },
        { id: "inability_chew", label: "Inability to incise and chew solid foods" },
        { id: "transverse_asymmetry", label: "Transverse/lateral assymetry" },
      ],
    },
    {
      category: "CLINICAL OBSERVATION",
      items: [
        { id: "minimal_atrophy_mandible", label: "minimal atrophy of mandible (ICD K08.21)" },
        { id: "minimal_atrophy_maxilla", label: "minimal atrophy of maxilla (ICD K08.24)" },
        { id: "moderate_atrophy_mandible", label: "moderate atrophy of mandible (ICD K08.22)" },
        { id: "moderate_atrophy_maxilla", label: "moderate atrophy of maxilla (ICD K08.25)" },
        { id: "severe_atrophy_mandible", label: "severe atrophy of mandible (ICD K08.23)" },
        { id: "severe_atrophy_maxilla", label: "severe atrophy of maxilla (ICD K08.26)" },
      ],
    },
    {
      items: [
        { id: "partial_loss_trauma", label: "Partial loss of tooth due to trauma (K08.419)" },
        { id: "partial_loss_nontrauma", label: "Partial loss of teeth, non-trauma (K03.81)" },
        { id: "lack_posterior_support", label: "lack of posterior occlusal support (M26.57)" },
        { id: "nonworking_interference", label: "non-working side interferance (M26.56)" },
        { id: "insufficient_guidance", label: "insufficient anterior guidance (M26.54)" },
        { id: "max_discrepancy", label: "maximum intercuspation discrepancy (M26.55)" },
        { id: "xerostomia", label: "Xerostomia (R68.2)" },
      ],
    },
  ];

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    console.log("Checkbox changed:", itemId, checked);
    setFormData({
      ...formData,
      functional_presentation: {
        ...formData.functional_presentation,
        [itemId]: checked,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {functionalItems.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {section.category && (
            <h3 className="text-lg font-semibold text-primary">{section.category}</h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-2">
                <Checkbox
                  id={item.id}
                  checked={formData.functional_presentation?.[item.id] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor={item.id}
                  className="text-sm leading-tight cursor-pointer"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};