import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DentalClassificationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const DentalClassificationSection = ({ formData, setFormData }: DentalClassificationSectionProps) => {
  const handleCheckboxChange = (category: string, subCategory: string, value: string) => {
    console.log(`Updating ${category}.${subCategory} with value: ${value}`);
    setFormData((prev: any) => ({
      ...prev,
      dental_classification: {
        ...prev.dental_classification,
        [category]: {
          ...prev.dental_classification?.[category],
          [subCategory]: value
        }
      }
    }));
  };

  const handleQuadrantChange = (category: string, quadrant: string) => {
    console.log(`Updating ${category} quadrant: ${quadrant}`);
    setFormData((prev: any) => ({
      ...prev,
      dental_classification: {
        ...prev.dental_classification,
        quadrants: {
          ...prev.dental_classification?.quadrants,
          [category]: {
            ...prev.dental_classification?.quadrants?.[category],
            [quadrant]: !prev.dental_classification?.quadrants?.[category]?.[quadrant]
          }
        }
      }
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Inflammation Classification */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-primary">Inflammation Classification (ICD M27.2)</Label>
        <div className="grid grid-cols-3 gap-4">
          {['mild', 'moderate', 'diffuse'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`inflammation-${type}`}
                checked={formData.dental_classification?.inflammation === type}
                onCheckedChange={() => handleCheckboxChange('inflammation', 'type', type)}
              />
              <Label htmlFor={`inflammation-${type}`} className="capitalize">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dental Status */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-primary">Dental Classification</Label>
        {['broken', 'missing', 'infected'].map((category) => (
          <div key={category} className="grid grid-cols-2 gap-4">
            <Label className="capitalize font-medium">{category} Teeth</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-single`}
                  checked={formData.dental_classification?.[category] === 'single'}
                  onCheckedChange={() => handleCheckboxChange(category, 'type', 'single')}
                />
                <Label htmlFor={`${category}-single`}>Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-multiple`}
                  checked={formData.dental_classification?.[category] === 'multiple'}
                  onCheckedChange={() => handleCheckboxChange(category, 'type', 'multiple')}
                />
                <Label htmlFor={`${category}-multiple`}>Multiple</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quadrant Selection */}
      <div className="space-y-4">
        {['broken', 'missing', 'infected'].map((category) => (
          <div key={`${category}-quadrant`} className="space-y-2">
            <Label className="capitalize font-medium">{category} teeth quadrant</Label>
            <div className="grid grid-cols-4 gap-4">
              {['UR', 'UL', 'LR', 'LL'].map((quadrant) => (
                <div key={`${category}-${quadrant}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${category}-${quadrant}`}
                    checked={formData.dental_classification?.quadrants?.[category]?.[quadrant]}
                    onCheckedChange={() => handleQuadrantChange(category, quadrant)}
                  />
                  <Label htmlFor={`${category}-${quadrant}`}>{quadrant}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bite Classification */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-primary">Bite Classification</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {[
              'normal',
              'moderate',
              'deep',
              'left_anterior_cross_bite',
              'left_posterior_cross_bite'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`bite-${type}`}
                  checked={formData.dental_classification?.bite === type}
                  onCheckedChange={() => handleCheckboxChange('bite', 'type', type)}
                />
                <Label htmlFor={`bite-${type}`} className="capitalize">
                  {type.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              'right_anterior_cross_bite',
              'right_posterior_cross_bite',
              'bilateral_posterior_cross_bite'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`bite-${type}`}
                  checked={formData.dental_classification?.bite === type}
                  onCheckedChange={() => handleCheckboxChange('bite', 'type', type)}
                />
                <Label htmlFor={`bite-${type}`} className="capitalize">
                  {type.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeletal Presentation */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-primary">Skeletal Presentation</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {[
              'retrognathic_maxilla',
              'retrognathic_mandible',
              'prognathic_mandible',
              'prognathic_maxilla',
              'ovoid_mandible'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`skeletal-${type}`}
                  checked={formData.dental_classification?.skeletal?.[type]}
                  onCheckedChange={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      dental_classification: {
                        ...prev.dental_classification,
                        skeletal: {
                          ...prev.dental_classification?.skeletal,
                          [type]: !prev.dental_classification?.skeletal?.[type]
                        }
                      }
                    }));
                  }}
                />
                <Label htmlFor={`skeletal-${type}`} className="capitalize">
                  {type.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              'tapered_mandible',
              'tapered_maxilla',
              'square_mandible',
              'square_maxilla',
              'ovoid_maxilla'
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`skeletal-${type}`}
                  checked={formData.dental_classification?.skeletal?.[type]}
                  onCheckedChange={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      dental_classification: {
                        ...prev.dental_classification,
                        skeletal: {
                          ...prev.dental_classification?.skeletal,
                          [type]: !prev.dental_classification?.skeletal?.[type]
                        }
                      }
                    }));
                  }}
                />
                <Label htmlFor={`skeletal-${type}`} className="capitalize">
                  {type.replace(/_/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};