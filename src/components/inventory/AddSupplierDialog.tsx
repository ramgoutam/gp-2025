import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AddSupplierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+91", country: "IN" },
  { code: "+52", country: "MX" },
  { code: "+55", country: "BR" },
  { code: "+61", country: "AU" },
];

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function AddSupplierDialog({ open, onOpenChange }: AddSupplierDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_person: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state: "AL",
    zip_code: "",
    notes: "",
  });

  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const phoneNumber = input.replace(/\D/g, '');
    
    if (countryCode === "+1") {
      // Format for US numbers (XXX) XXX-XXXX
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
    
    // For other countries, just group by 3 digits
    return phoneNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedValue });
  };

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    setFormData({ ...formData, phone: '' }); // Clear phone when country code changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullAddress = `${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}`;
      const { error } = await supabase.from("suppliers").insert([{
        supplier_name: formData.supplier_name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress,
        notes: formData.notes,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Supplier added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      onOpenChange(false);
      setFormData({
        supplier_name: "",
        contact_person: "",
        email: "",
        phone: "",
        street_address: "",
        city: "",
        state: "AL",
        zip_code: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplier_name">Supplier Name *</Label>
            <Input
              id="supplier_name"
              value={formData.supplier_name}
              onChange={(e) =>
                setFormData({ ...formData, supplier_name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) =>
                setFormData({ ...formData, contact_person: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex gap-2">
              <Select defaultValue={countryCode} onValueChange={handleCountryCodeChange}>
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent className="bg-white min-w-[90px]">
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={countryCode === "+1" ? "(555) 555-5555" : "123 456 789"}
                className="flex-1"
                maxLength={countryCode === "+1" ? 14 : 15}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="street_address">Street Address</Label>
            <Input
              id="street_address"
              value={formData.street_address}
              onChange={(e) =>
                setFormData({ ...formData, street_address: e.target.value })
              }
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                defaultValue={formData.state} 
                onValueChange={(value) => setFormData({ ...formData, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip_code">ZIP Code</Label>
            <Input
              id="zip_code"
              value={formData.zip_code}
              onChange={(e) =>
                setFormData({ ...formData, zip_code: e.target.value })
              }
              placeholder="12345"
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}