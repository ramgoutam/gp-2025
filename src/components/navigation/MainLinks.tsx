import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Megaphone, UserPlus, Calendar, ChevronRight, Package, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MainLinks = () => {
  const location = useLocation();
  const session = useSession();

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role;
    },
    enabled: !!session?.user?.id,
  });

  console.log('User role:', userRole);
  
  const mainLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patients", label: "Patients", icon: Users },
    ...(userRole === 'ADMIN' ? [{ to: "/admin", label: "Admin", icon: Shield }] : []),
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
    </div>
  );
};