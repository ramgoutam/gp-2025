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
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/20 transition-colors">
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-semibold text-primary">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="text-gray-500 mt-1">
              Manage patient's personal details and contact information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            label="Email Address" 
            value={email} 
          />
          <InfoItem 
            icon={Phone}
            label="Phone Number" 
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
            <div className="md:col-span-2 lg:col-span-3">
              <InfoItem 
                icon={MapPin}
                label="Address" 
                value={address}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};