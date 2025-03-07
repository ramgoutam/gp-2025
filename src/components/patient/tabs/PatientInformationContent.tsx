import React from "react";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, MapPin, User2, Stethoscope } from "lucide-react";

type PatientInformationProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
  treatmentType?: string;
  upperTreatment?: string;
  lowerTreatment?: string;
};

export const PatientInformationContent = ({
  firstName,
  lastName,
  email,
  phone,
  sex,
  dob,
  address,
  treatmentType,
  upperTreatment,
  lowerTreatment,
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
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  // Helper function to safely capitalize strings
  const capitalize = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="overflow-hidden bg-white">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoItem 
          icon={User2}
          label="First Name" 
          value={firstName || ''} 
        />
        <InfoItem 
          icon={User2}
          label="Last Name" 
          value={lastName || ''} 
        />
        <InfoItem 
          icon={Mail}
          label="Email" 
          value={email || ''} 
        />
        <InfoItem 
          icon={Phone}
          label="Phone" 
          value={phone || ''} 
        />
        <InfoItem 
          icon={User2}
          label="Sex" 
          value={capitalize(sex)} 
        />
        <InfoItem 
          icon={Calendar}
          label="Date of Birth" 
          value={dob ? new Date(dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : ''} 
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
        {treatmentType && (
          <div className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem 
                icon={Stethoscope}
                label="Treatment Type" 
                value={capitalize(treatmentType)}
              />
              {upperTreatment && (
                <InfoItem 
                  icon={Stethoscope}
                  label="Upper Treatment" 
                  value={upperTreatment}
                />
              )}
              {lowerTreatment && (
                <InfoItem 
                  icon={Stethoscope}
                  label="Lower Treatment" 
                  value={lowerTreatment}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};