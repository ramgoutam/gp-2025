import React from "react";
import { Loader } from "lucide-react";
import { Login } from "@/components/auth/Login";

interface AuthWrapperProps {
  loading: boolean;
  session: any;
  children: React.ReactNode;
}

export const AuthWrapper = ({ loading, session, children }: AuthWrapperProps) => {
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <>{children}</>;
};