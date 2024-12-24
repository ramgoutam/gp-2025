import React from "react";

type PatientAvatarProps = {
  firstName: string;
  lastName: string;
  avatar?: string;
};

export const PatientAvatar = ({ firstName, lastName, avatar }: PatientAvatarProps) => {
  return avatar ? (
    <img
      src={avatar}
      alt={`${firstName} ${lastName}`}
      className="w-16 h-16 rounded-full object-cover bg-gray-100"
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
      {firstName[0]}
      {lastName[0]}
    </div>
  );
};