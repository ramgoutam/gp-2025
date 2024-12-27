import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings,
  ClipboardList,
  Factory
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Scripts', href: '/scripts', icon: FileText },
  { name: 'Reports', href: '/reports', icon: ClipboardList },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Manufacturing', href: '/manufacturing', icon: Factory },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};