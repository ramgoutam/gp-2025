import { Link, useLocation } from "react-router-dom";
import { Beaker, TestTube, FileText, Factory, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const LabMenu = () => {
  const location = useLocation();

  const labLinks = [
    { to: "/scripts", label: "Lab Scripts", icon: TestTube },
    { to: "/reports", label: "Report Cards", icon: FileText },
    { to: "/manufacturing", label: "Manufacturing", icon: Factory },
    { to: "/inventory", label: "Inventory", icon: Package },
  ];

  const isLabRoute = labLinks.some(link => location.pathname === link.to);
  const activeLabLink = labLinks.find(link => location.pathname === link.to);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isLabRoute ? "default" : "ghost"}
          size="sm"
          className={cn(
            "flex items-center space-x-2",
            isLabRoute && "bg-primary text-white"
          )}
        >
          <Beaker className="w-4 h-4" />
          <span>{activeLabLink ? activeLabLink.label : "Lab"}</span>
          <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48 shadow-lg bg-white border border-gray-200 rounded-md z-50"
      >
        {labLinks.map(({ to, label, icon: Icon }) => (
          <DropdownMenuItem key={to} asChild>
            <Link
              to={to}
              className={cn(
                "flex items-center space-x-2 w-full px-3 py-2 hover:bg-gray-50",
                location.pathname === to && "bg-primary/10"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};