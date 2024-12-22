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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">First Name</h3>
          <p className="mt-1 text-base text-gray-900">{firstName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
          <p className="mt-1 text-base text-gray-900">{lastName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 text-base text-gray-900">{email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
          <p className="mt-1 text-base text-gray-900">{phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Sex</h3>
          <p className="mt-1 text-base text-gray-900 capitalize">{sex}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
          <p className="mt-1 text-base text-gray-900">
            {new Date(dob).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};