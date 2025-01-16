import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const MainLinks = () => {
  const location = useLocation();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (session?.user?.id) {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        setIsAdmin(userRole?.role === 'ADMIN');
      }
    };

    checkAdminRole();
  }, [session]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex space-x-4">
      <Link
        to="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/") ? "text-primary" : "text-gray-600"
        }`}
      >
        Dashboard
      </Link>
      <Link
        to="/patients"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/patients") ? "text-primary" : "text-gray-600"
        }`}
      >
        Patients
      </Link>
      <Link
        to="/marketing"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/marketing") ? "text-primary" : "text-gray-600"
        }`}
      >
        Marketing
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive("/admin") ? "text-primary" : "text-gray-600"
          }`}
        >
          Admin
        </Link>
      )}
    </div>
  );
};