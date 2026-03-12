import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit code");
      return;
    }

    setLoading(true);
    const storedOtp = sessionStorage.getItem("reset_otp");

    if (otp === storedOtp) {
      toast.success("Verification successful!");
      sessionStorage.removeItem("reset_otp");
      navigate("/reset-password");
    } else {
      toast.error("Invalid verification code. Please try again.");
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
      <div className="mb-10 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Verify</h1>
        <p className="text-sm text-muted-foreground">Enter the 4-digit verification code</p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center mb-10">
        <InputOTP maxLength={4} value={otp} onChange={setOtp}>
          <InputOTPGroup className="gap-3">
            <InputOTPSlot index={0} className="h-14 w-14 rounded-lg border-input bg-card text-lg font-semibold" />
            <InputOTPSlot index={1} className="h-14 w-14 rounded-lg border-input bg-card text-lg font-semibold" />
            <InputOTPSlot index={2} className="h-14 w-14 rounded-lg border-input bg-card text-lg font-semibold" />
            <InputOTPSlot index={3} className="h-14 w-14 rounded-lg border-input bg-card text-lg font-semibold" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Continue button */}
      <div className="flex justify-center">
        <Button
          onClick={handleVerify}
          variant="warm"
          size="lg"
          className="h-14 w-full max-w-xs rounded-lg"
          disabled={loading}
        >
          {loading ? "..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOTP;
