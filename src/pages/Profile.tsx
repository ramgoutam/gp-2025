import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, User as UserIcon, Key, Shield } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setEmail(user.email || "");
          setUsername(user.user_metadata.username || "");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: { username: username }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error("Error sending reset password email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and set your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center p-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                />
                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <div className="relative">
                <div className="pl-10 py-2 bg-muted rounded-md text-muted-foreground">
                  {user?.role || "authenticated"}
                </div>
                <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                onClick={handleUpdateProfile} 
                className="w-full"
                disabled={updating}
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>

              <Button
                variant="outline"
                onClick={handleResetPassword}
                className="w-full"
              >
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}