import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export const MainLinks = () => {
  const location = useLocation();
  
  const mainLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/marketing", label: "Marketing", icon: Megaphone },
    { to: "/patients", label: "Patients", icon: Users },
  ];

  return (
    <div className="flex space-x-4">
      {mainLinks.map(({ to, label, icon: Icon }) => (
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
  );
};