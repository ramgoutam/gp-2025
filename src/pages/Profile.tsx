import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { Loader2, Mail, User as UserIcon, Calendar } from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Fetching user data...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate('/login');
          return;
        }
        console.log("User data fetched:", user);
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Mail className="w-4 h-4" />
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
              </div>
              <p className="text-gray-900">{user?.email}</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center gap-2 text-primary">
                <UserIcon className="w-4 h-4" />
                <h3 className="text-sm font-medium text-gray-500">Username</h3>
              </div>
              <p className="text-gray-900">{user?.user_metadata.username || user?.email?.split('@')[0] || 'Not set'}</p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              </div>
              <p className="text-gray-900">
                {new Date(user?.created_at || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;