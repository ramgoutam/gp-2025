import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, ClipboardList, FileText } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Patients", icon: Users },
    { to: "/scripts", label: "Lab Scripts", icon: ClipboardList },
    { to: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center space-x-8 h-16">
          <div className="text-primary font-bold text-xl">DentalTracker</div>
          <div className="flex space-x-4">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === to
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};