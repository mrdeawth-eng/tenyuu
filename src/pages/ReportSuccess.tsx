import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReportSuccess = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-6">
      
      <h1 className="font-display text-2xl font-bold text-foreground text-center">
        {t.reportSuccess}
      </h1>

      <Button
        variant="warm"
        size="lg"
        onClick={() => navigate("/profile-account")}
      >
        Back to Profile
      </Button>

    </div>
  );
};

export default ReportSuccess;