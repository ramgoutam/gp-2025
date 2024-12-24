import React from "react";

export interface PatientAvatarProps {
  firstName: string;
  lastName: string;
  avatar?: string;
}

export const PatientAvatar = ({ firstName, lastName, avatar }: PatientAvatarProps) => {
  // Add null checks and provide default values
  const firstInitial = firstName ? firstName[0] : '';
  const lastInitial = lastName ? lastName[0] : '';

  return avatar ? (
    <img
      src={avatar}
      alt={`${firstName} ${lastName}`}
      className="w-16 h-16 rounded-full object-cover bg-gray-100"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
      {firstInitial}
      {lastInitial}
    </div>
  );
};