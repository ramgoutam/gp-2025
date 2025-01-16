import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";

export default function Login() {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        <CardHeader className="space-y-4 text-center pb-0">
          <div className="flex justify-center items-center py-6">
            <img
              src="https://zqlchnhpfdwmqdpmdntc.supabase.co/storage/v1/object/public/Website_images/Logo.png"
              alt="Company Logo"
              className="h-20 w-auto object-contain transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4F6BFF',
                    brandAccent: '#3D54CC',
                  },
                },
              },
            }}
            providers={[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}