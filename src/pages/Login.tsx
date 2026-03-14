import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/recipes", { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
      if (error) toast.error(error.message); else toast.success("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-10">
        <h1 className="text-center font-display text-5xl font-bold tracking-widest text-foreground">TENYUU</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <IconInput icon={User} type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          <IconInput icon={Lock} type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />

          {!isRegister && (
            <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
              {t.forgetPassword}
            </button>
          )}

          <div className="space-y-3 pt-2">
            <Button type="submit" variant="warm" size="lg" className="w-full h-14 rounded-lg" disabled={loading}>
              {loading ? "..." : isRegister ? t.registerBtn : t.loginBtn}
            </Button>
            <Button type="button" variant="warm" size="lg" className="w-full h-14 rounded-lg" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? t.backToLogin : t.registerBtn}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Login;
