import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplianceSection } from "@/components/lab-script/ApplianceSection";
import { TreatmentSection } from "@/components/lab-script/TreatmentSection";
import { ScrewSection } from "@/components/lab-script/ScrewSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LabReportFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  patientData?: {
    firstName: string;
    lastName: string;
  };
}

const IMPLANT_LIBRARIES = ["Nobel Biocare", "Straumann", "Zimmer Biomet", "Dentsply Sirona"];
const TEETH_LIBRARIES = ["Premium", "Standard", "Economy"];
const FIT_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const FEEDBACK_OPTIONS = ["Positive", "Neutral", "Needs Improvement"];
const OCCLUSION_OPTIONS = ["Perfect", "Slight Adjustment Needed", "Major Adjustment Needed"];
const ESTHETICS_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const ADJUSTMENTS_OPTIONS = ["None", "Minor", "Major"];
const MATERIAL_OPTIONS = ["Zirconia", "PMMA", "Titanium", "Other"];
const SHADE_OPTIONS = ["A1", "A2", "A3", "A3.5", "A4", "B1", "B2", "B3", "B4"];

export const LabReportForm = ({ onSubmit, onCancel, patientData }: LabReportFormProps) => {
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    patientName: patientData ? `${patientData.firstName} ${patientData.lastName}` : "",
    applianceType: "",
    designDate: new Date().toISOString().split('T')[0],
    upperTreatment: "None",
    lowerTreatment: "None",
    screw: "",
    implantLibrary: "",
    teethLibrary: "",
    latestApplianceId: "",
    actionsTaken: "",
    insertionDate: "",
    applianceFit: "",
    designFeedback: "",
    occlusion: "",
    esthetics: "",
    adjustmentsMade: "",
    latestApplianceInserted: "",
    material: "",
    shade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting lab report:", formData);
    onSubmit(formData);
  };

  return (
    <ScrollArea className="h-[80vh] w-full pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            name="patientName"
            value={formData.patientName}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>

      <ApplianceSection
        value={formData.applianceType}
        onChange={(value) => handleSelectChange("applianceType", value)}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Design Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="designDate">Design Date</Label>
            <Input
              id="designDate"
              name="designDate"
              type="date"
              value={formData.designDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TreatmentSection
            title="Upper"
            treatment={formData.upperTreatment}
            onTreatmentChange={(value) => handleSelectChange("upperTreatment", value)}
          />
          <TreatmentSection
            title="Lower"
            treatment={formData.lowerTreatment}
            onTreatmentChange={(value) => handleSelectChange("lowerTreatment", value)}
          />
        </div>

        <ScrewSection
          value={formData.screw}
          onChange={(value) => handleSelectChange("screw", value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="implantLibrary">Implant Library</Label>
            <Select
              value={formData.implantLibrary}
              onValueChange={(value) => handleSelectChange("implantLibrary", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select implant library" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {IMPLANT_LIBRARIES.map((lib) => (
                  <SelectItem key={lib} value={lib}>
                    {lib}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teethLibrary">Teeth Library</Label>
            <Select
              value={formData.teethLibrary}
              onValueChange={(value) => handleSelectChange("teethLibrary", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teeth library" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {TEETH_LIBRARIES.map((lib) => (
                  <SelectItem key={lib} value={lib}>
                    {lib}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Actions Taken</h3>
          <div className="space-y-2">
            <Label htmlFor="actionsTaken">Designer Actions & Changes Made</Label>
            <Textarea
              id="actionsTaken"
              name="actionsTaken"
              value={formData.actionsTaken}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Clinical Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insertionDate">Insertion Date</Label>
              <Input
                id="insertionDate"
                name="insertionDate"
                type="date"
                value={formData.insertionDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applianceFit">Appliance Fit</Label>
              <Select
                value={formData.applianceFit}
                onValueChange={(value) => handleSelectChange("applianceFit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fit quality" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {FIT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designFeedback">Design Feedback</Label>
              <Select
                value={formData.designFeedback}
                onValueChange={(value) => handleSelectChange("designFeedback", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {FEEDBACK_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occlusion">Occlusion</Label>
              <Select
                value={formData.occlusion}
                onValueChange={(value) => handleSelectChange("occlusion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occlusion status" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {OCCLUSION_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="esthetics">Esthetics</Label>
              <Select
                value={formData.esthetics}
                onValueChange={(value) => handleSelectChange("esthetics", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select esthetics quality" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {ESTHETICS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjustmentsMade">Adjustments Made</Label>
              <Select
                value={formData.adjustmentsMade}
                onValueChange={(value) => handleSelectChange("adjustmentsMade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adjustments" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {ADJUSTMENTS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select
                value={formData.material}
                onValueChange={(value) => handleSelectChange("material", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {MATERIAL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shade">Shade</Label>
              <Select
                value={formData.shade}
                onValueChange={(value) => handleSelectChange("shade", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shade" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100]">
                  {SHADE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Report
        </Button>
      </div>
      </form>
    </ScrollArea>
  );
};
