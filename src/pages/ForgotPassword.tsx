import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);

    // Generate a 4-digit OTP and store it temporarily
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem("reset_otp", otp);
    sessionStorage.setItem("reset_email", email);

    // Use Supabase to send password reset email (the OTP is for our custom verification)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Verification code sent to ${email}`);
      // Navigate to verify page with OTP stored in session
      navigate("/verify-otp");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-12 flex h-10 w-10 items-center justify-center rounded-full bg-card transition-colors hover:bg-accent active:bg-accent/80"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>

      {/* Title */}
      <h1 className="mb-10 font-display text-3xl font-bold leading-tight text-foreground">
        Forgot Your{"\n"}Password{"\n"}And Continue
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <IconInput
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="warm"
          size="lg"
          className="h-14 w-48 rounded-lg"
          disabled={loading}
        >
          {loading ? "..." : "Submit Now"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
