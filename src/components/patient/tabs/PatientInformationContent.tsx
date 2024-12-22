import React from "react";

type PatientInformationProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
};

export const PatientInformationContent = ({
  firstName,
  lastName,
  email,
  phone,
  sex,
  dob,
}: PatientInformationProps) => {
  const InfoCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard label="First Name" value={firstName} />
          <InfoCard label="Last Name" value={lastName} />
          <InfoCard label="Email" value={email} />
          <InfoCard label="Phone" value={phone} />
          <InfoCard 
            label="Sex" 
            value={sex.charAt(0).toUpperCase() + sex.slice(1)} 
          />
          <InfoCard 
            label="Date of Birth" 
            value={new Date(dob).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} 
          />
        </div>
      </div>
    </div>
  );
};