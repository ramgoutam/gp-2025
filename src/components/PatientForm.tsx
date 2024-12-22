import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
}

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmitSuccess?: (data: PatientFormData) => void;
}

export const PatientForm = ({ initialData, onSubmitSuccess }: PatientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "",
    dob: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient data:", formData);
    
    onSubmitSuccess?.(formData);
    
    if (!onSubmitSuccess) {
      toast({
        title: "Success",
        description: "Patient information saved successfully",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        sex: "",
        dob: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="sex">Sex</Label>
        <Select
          value={formData.sex}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Patient Information" : "Save Patient Information"}
      </Button>
    </form>
  );
};