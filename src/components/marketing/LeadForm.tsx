import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  primaryReason: string;
  problem: string;
}

export const LeadForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    primaryReason: "",
    problem: "",
  });

  const primaryReasons = [
    { id: "A", label: "I'm Ready To Fix My Smile and Want To Know About Pricing" },
    { id: "B", label: "I have pain and discomfort" },
    { id: "C", label: "I'm coming for a second consultation" },
    { id: "D", label: "I've heard a lot about Dr. Charles and I'd like to move forward with working him." },
  ];

  const problems = [
    { id: "A", label: "I have pain and discomfort" },
    { id: "B", label: "Infection" },
    { id: "C", label: "Bone Loss" },
    { id: "D", label: "Most of My Teeth Are Missing and In Bad Shape" },
    { id: "E", label: "Struggling With Traditional Dentures" },
    { id: "F", label: "Multiple Missing Teeth" },
    { id: "G", label: "I only have a one tooth problem" },
    { id: "H", label: "I Still have my teeth and looking for general dental health" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: `Primary Reason: ${formData.primaryReason}\nProblem: ${formData.problem}`,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        primaryReason: "",
        problem: "",
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What is the primary reason you're seeking for dental implants?*</h2>
        <RadioGroup
          value={formData.primaryReason}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryReason: value }))}
          required
          className="space-y-2"
        >
          {primaryReasons.map((reason) => (
            <div key={reason.id} className="flex items-center space-x-2">
              <RadioGroupItem value={reason.label} id={`reason-${reason.id}`} />
              <Label htmlFor={`reason-${reason.id}`}>{reason.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What seems to be the problem?*</h2>
        <RadioGroup
          value={formData.problem}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, problem: value }))}
          required
          className="space-y-2"
        >
          {problems.map((problem) => (
            <div key={problem.id} className="flex items-center space-x-2">
              <RadioGroupItem value={problem.label} id={`problem-${problem.id}`} />
              <Label htmlFor={`problem-${problem.id}`}>{problem.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};