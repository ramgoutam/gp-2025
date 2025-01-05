import React from "react";
import { Link } from "react-router-dom";
import { Package, Users, FileText, Home, Settings, ClipboardList, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  return (
    <nav>
      <Link to="/" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link to="/patients" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <Users className="h-5 w-5" />
        <span>Patients</span>
      </Link>
      <Link to="/lab-scripts" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <FileText className="h-5 w-5" />
        <span>Lab Scripts</span>
      </Link>
      <Link to="/report-cards" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <FileCheck className="h-5 w-5" />
        <span>Report Cards</span>
      </Link>
      <Link to="/inventory/items" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <Package className="h-5 w-5" />
        <span>Inventory</span>
      </Link>
      <Link to="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
        <Settings className="h-5 w-5" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default Navigation;