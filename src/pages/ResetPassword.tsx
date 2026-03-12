import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/icon-input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset successfully!");
      sessionStorage.removeItem("reset_email");
      navigate("/", { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-16 flex h-10 w-10 items-center justify-center rounded-full bg-card transition-colors hover:bg-accent active:bg-accent/80"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>

      {/* Title */}
      <h1 className="mb-10 font-display text-3xl font-bold text-foreground">Reset Password</h1>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-5">
        <IconInput
          icon={Lock}
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <IconInput
          icon={Lock}
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="warm"
            size="lg"
            className="h-14 w-full rounded-lg"
            disabled={loading}
          >
            {loading ? "..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
