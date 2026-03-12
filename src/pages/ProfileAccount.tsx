import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold">{t.account}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-5 py-6">
        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-sm text-muted-foreground mb-1">{t.email}</p>
            <p className="font-medium text-foreground">{user?.email || t.noEmail}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground mb-1">{t.password}</p>
            <p className="font-medium text-foreground tracking-[0.2em]">••••••••</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileAccount;
