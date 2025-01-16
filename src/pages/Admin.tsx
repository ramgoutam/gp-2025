import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate('/login');
        return;
      }

      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !roles || roles.role !== 'ADMIN') {
        console.log('Access denied: User is not an admin');
        navigate('/');
        return;
      }
    };

    checkAdminAccess();
  }, [session, navigate]);

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium mb-2">User Management</h2>
          <p className="text-gray-600">Manage users and their roles</p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium mb-2">System Settings</h2>
          <p className="text-gray-600">Configure system-wide settings</p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium mb-2">Access Control</h2>
          <p className="text-gray-600">Manage permissions and access levels</p>
        </Card>
      </div>
    </div>
  );
};

export default Admin;