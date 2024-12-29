import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./form/QuestionCard";
import { formQuestions } from "./form/formQuestions";

interface LeadFormData {
  [key: string]: string;
}

export const LeadForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>(
    Object.fromEntries(formQuestions.map((q) => [q.id, ""]))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const { error } = await supabase.from("leads").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: message,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      // Reset form
      setFormData(Object.fromEntries(formQuestions.map((q) => [q.id, ""])));
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < formQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleChange = (value: string) => {
    const currentQuestionId = formQuestions[currentQuestion].id;
    setFormData(prev => ({ ...prev, [currentQuestionId]: value }));
    
    // Automatically move to next question when a radio option is selected
    if (formQuestions[currentQuestion].type === "radio") {
      handleNext();
    }
  };

  const isLastQuestion = currentQuestion === formQuestions.length - 1;
  const currentQuestionData = formQuestions[currentQuestion];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative min-h-[400px]">
        {formQuestions.map((question, index) => (
          <div
            key={question.id}
            className={`absolute w-full transition-all duration-500 ${
              index === currentQuestion ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <QuestionCard
              title={question.title}
              type={question.type}
              options={question.options}
              value={formData[question.id]}
              onChange={handleChange}
              inputType={question.inputType}
              isActive={index === currentQuestion}
              maxLength={question.maxLength}
              pattern={question.pattern}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!formData[currentQuestionData.id]}
          >
            Next
          </Button>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {formQuestions.length}
        </p>
      </div>
    </form>
  );
};