import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface GuidelineQuestionsSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const GuidelineQuestionsSection = ({
  formData,
  setFormData,
}: GuidelineQuestionsSectionProps) => {
  const handleOptionChange = (questionId: string, value: boolean) => {
    console.log(`Updating question ${questionId}:`, value);
    setFormData((prev: any) => ({
      ...prev,
      guideline_questions: {
        ...prev.guideline_questions,
        [questionId]: value,
      },
    }));
  };

  const questions = [
    {
      id: "weight_loss",
      text: "Patient reports weight loss due to malnutrition",
    },
    {
      id: "persistent_pain",
      text: "The pain in the mouth has persisted more than 6 months",
    },
    {
      id: "speaking_problems",
      text: "Problems speaking which has been documented by a physician",
    },
    {
      id: "sleep_apnea",
      text: "Moderate to severe obstructive sleep apnea, as measured by polysomnography (report must be attached in files uploaded)",
    },
    {
      id: "otc_medications",
      text: "The patient tried over the counter medications for oral pain, but to no avail",
    },
    {
      id: "failed_therapy",
      text: "Patient has tried other forms of therapy which have failed to resolve issue",
    },
    {
      id: "oral_appliances",
      text: "Patient has tried oral appliances (ie partial, denture, flipper)",
    },
    {
      id: "non_surgical_therapies",
      text: "Patient has tried non-surgical therapies prior to surgery",
    },
    {
      id: "q1_missing_1_3",
      text: "Quadrant 1 missing 1-3 teeth (21248)",
    },
    {
      id: "q1_missing_4_more",
      text: "Quadrant 1 missing 4 or more teeth (21249)",
    },
    {
      id: "q2_missing_1_3",
      text: "Quadrant 2 missing 1-3 teeth (21248)",
    },
    {
      id: "q2_missing_4_more",
      text: "Quadrant 2 missing 4 or more teeth (21249)",
    },
    {
      id: "q3_missing_1_3",
      text: "Quadrant 3 missing 1-3 teeth (21248)",
    },
    {
      id: "q3_missing_4_more",
      text: "Quadrant 3 missing 4 or more teeth (21249)",
    },
    {
      id: "q4_missing_1_3",
      text: "Quadrant 4 missing 1-3 teeth (21248)",
    },
    {
      id: "q4_missing_4_more",
      text: "Quadrant 4 missing 4 or more teeth (21249)",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4">
        {questions.map((question) => (
          <Card key={question.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-4">
              <Label className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {question.text}
              </Label>
              <Switch
                checked={formData.guideline_questions?.[question.id] || false}
                onCheckedChange={(checked) => handleOptionChange(question.id, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};