import React from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, MapPin, User2 } from "lucide-react";

type PatientInformationProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
};

export const PatientInformationContent = ({
  firstName,
  lastName,
  email,
  phone,
  sex,
  dob,
  address,
}: PatientInformationProps) => {
  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string;
  }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100 hover:border-primary/20 transition-all duration-200 hover:shadow-sm">
      <div className="p-2 rounded-lg bg-primary/5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoItem 
          icon={User2}
          label="First Name" 
          value={firstName} 
        />
        <InfoItem 
          icon={User2}
          label="Last Name" 
          value={lastName} 
        />
        <InfoItem 
          icon={Mail}
          label="Email" 
          value={email} 
        />
        <InfoItem 
          icon={Phone}
          label="Phone" 
          value={phone} 
        />
        <InfoItem 
          icon={User2}
          label="Sex" 
          value={sex.charAt(0).toUpperCase() + sex.slice(1)} 
        />
        <InfoItem 
          icon={Calendar}
          label="Date of Birth" 
          value={new Date(dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} 
        />
        {address && (
          <div className="col-span-full">
            <InfoItem 
              icon={MapPin}
              label="Address" 
              value={address}
            />
          </div>
        )}
      </div>
    </Card>
  );
};