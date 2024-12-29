import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface LeadFormData {
  missingTeeth: string;
  age: string;
  currentSolutions: string;
  missingDuration: string;
  eatingDifficulty: string;
  experiencingPain: string;
  confidenceIssues: string;
  previousConsultation: string;
  readiness: string;
  paymentPlanInterest: string;
  costAwareness: string;
  creditScore: string;
  householdIncome: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const LeadForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    missingTeeth: "",
    age: "",
    currentSolutions: "",
    missingDuration: "",
    eatingDifficulty: "",
    experiencingPain: "",
    confidenceIssues: "",
    previousConsultation: "",
    readiness: "",
    paymentPlanInterest: "",
    costAwareness: "",
    creditScore: "",
    householdIncome: "",
    zipCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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
      setFormData({
        missingTeeth: "",
        age: "",
        currentSolutions: "",
        missingDuration: "",
        eatingDifficulty: "",
        experiencingPain: "",
        confidenceIssues: "",
        previousConsultation: "",
        readiness: "",
        paymentPlanInterest: "",
        costAwareness: "",
        creditScore: "",
        householdIncome: "",
        zipCode: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
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

  const renderRadioGroup = (
    name: keyof LeadFormData,
    label: string,
    options: string[]
  ) => (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{label}</Label>
      <RadioGroup
        value={formData[name]}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, [name]: value }))}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${name}-${option}`} />
            <Label htmlFor={`${name}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderRadioGroup("missingTeeth", "How Many Teeth Are You Currently Missing?*", [
        "All",
        "6+",
        "4-5",
        "3 Or Less",
      ])}

      {renderRadioGroup("age", "What Is Your Age?*", [
        "60+",
        "50-59",
        "40-49",
        "<40",
      ])}

      {renderRadioGroup("currentSolutions", "Do you currently have any of these dental solutions?*", [
        "Denture or Partial Denture",
        "Bridge, Crown",
        "Dental Implant",
        "None of the above",
      ])}

      {renderRadioGroup("missingDuration", "How Long Have You Been Missing Your Teeth?*", [
        "I Still Have Them",
        "1-6 Months",
        "7-12 Months",
        "1+ Years",
      ])}

      {renderRadioGroup("eatingDifficulty", "Are You Currently Unable To Eat Certain Foods Or Have To Modify The Way You Chew?*", [
        "Yes",
        "No",
      ])}

      {renderRadioGroup("experiencingPain", "Are You Currently Trying To Find Relief From Any Kind Of Pain Or Discomfort?*", [
        "Yes",
        "No",
      ])}

      {renderRadioGroup("confidenceIssues", "Are You Currently Experiencing A Lack Of Confidence In Social Situations or Find Yourself Hiding Your Smile?*", [
        "Yes",
        "No",
      ])}

      {renderRadioGroup("previousConsultation", "Have You Had A Dental Implant Consultation With Another Dentist?*", [
        "Yes",
        "No",
      ])}

      {renderRadioGroup("readiness", "How Ready Do You Feel To Do Something About Your Situation?*", [
        "Somewhat Ready",
        "Very Ready",
        "I Need Something FAST!",
      ])}

      {renderRadioGroup("paymentPlanInterest", "Are you interested in a payment plan option?*", [
        "Yes. I'm interested in affordable payment plan options",
        "No. I've been saving for this type of procedure and will not need a payment plan",
      ])}

      {renderRadioGroup("costAwareness", "Would you like to see if you qualify for payment plans, or still continue without?*", [
        "Yes, please tell me if I might qualify for a payment plan",
        "No, I don't need a payment plan",
      ])}

      {renderRadioGroup("creditScore", "Which best describes your credit?*", [
        "(Poor) Under 660",
        "(Fair) 660-699",
        "(Good) 700-739",
        "(Excellent) 740+",
      ])}

      {renderRadioGroup("householdIncome", "Which best describes your current household monthly income?*", [
        "Under $5,000",
        "$5,000 to $8,000",
        "Over $8,000",
      ])}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">What Is Your Zip Code? (Enter 5 Digits Only)*</Label>
          <Input
            id="zipCode"
            required
            maxLength={5}
            pattern="[0-9]{5}"
            value={formData.zipCode}
            onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">What Is Your First Name?*</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">What Is Your Last Name?*</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone*</Label>
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};