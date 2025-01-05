import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Megaphone, UserPlus, Calendar, ChevronRight, Package, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LabMenu } from "./LabMenu";

export const MainLinks = () => {
  const location = useLocation();
  
  const mainLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
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

      <LabMenu />

      <Link
        to="/inventory"
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          location.pathname === "/inventory"
            ? "bg-primary text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <Package className="w-4 h-4" />
        <span>Inventory</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            (location.pathname === "/marketing" || 
             location.pathname === "/leads" || 
             location.pathname === "/consultations")
              ? "bg-primary text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Megaphone className="w-4 h-4" />
          <span>Marketing</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem>
            <Link 
              to="/marketing" 
              className="flex items-center w-full"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Overview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link 
              to="/leads" 
              className="flex items-center w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Leads
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link 
              to="/consultations" 
              className="flex items-center w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Consultations
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};