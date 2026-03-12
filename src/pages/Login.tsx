import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/recipes", { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Brand */}
        <h1 className="text-center font-display text-5xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
        <p className="text-center text-sm text-muted-foreground -mt-6">
          Discover & share recipes
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <IconInput
            icon={User}
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <IconInput
            icon={Lock}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isRegister && (
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Forget Password ?
            </button>
          )}

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              variant="warm"
              size="lg"
              className="w-full h-14 rounded-lg"
              disabled={loading}
            >
              {loading ? "..." : isRegister ? "Register" : "Login"}
            </Button>
            <Button
              type="button"
              variant="warm"
              size="lg"
              className="w-full h-14 rounded-lg"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Back to Login" : "Register"}
            </Button>
          </div>
        </form>

        {/* Social */}
        <div className="text-center space-y-4">
          <span className="text-sm text-muted-foreground">-or-</span>
          <div className="flex justify-center gap-6">
            <button className="text-foreground hover:text-muted-foreground transition-colors" aria-label="Sign in with Google">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button className="text-foreground hover:text-muted-foreground transition-colors" aria-label="Sign in with Apple">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
