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
    <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors duration-200">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-medium text-primary">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {firstName} {lastName}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Personal Information
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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