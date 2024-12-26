import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, TestTube, Factory, FileText } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/scripts", label: "Scripts", icon: TestTube },
    { to: "/report-card", label: "Report Card", icon: FileText },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};