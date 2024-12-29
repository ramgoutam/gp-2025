import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./form/QuestionCard";
import { formQuestions } from "./form/formQuestions";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

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
        title: "Thank you!",
        description: "We've received your information and will be in touch soon.",
        className: "bg-primary text-white",
      });

      setFormData(Object.fromEntries(formQuestions.map((q) => [q.id, ""])));
      setCurrentQuestion(0);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Oops!",
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
    
    if (formQuestions[currentQuestion].type === "radio") {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const isLastQuestion = currentQuestion === formQuestions.length - 1;
  const currentQuestionData = formQuestions[currentQuestion];
  const canProceed = formData[currentQuestionData.id];

  return (
    <div className="min-h-[600px] px-4 py-8 md:px-6 relative">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
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
                currentStep={currentQuestion}
                totalSteps={formQuestions.length}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button 
              type="submit" 
              disabled={isSubmitting || !canProceed}
              className="flex items-center gap-2 bg-primary hover:bg-primary-600"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-primary hover:bg-primary-600"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};