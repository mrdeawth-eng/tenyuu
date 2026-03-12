import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Moon, Globe, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleDarkToggle = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-5 h-16">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-accent active:bg-accent/80 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold">{t.setting}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-5 py-6 space-y-6">
        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          {/* Account */}
          <button
            onClick={() => navigate("/profile/account")}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </div>
              <span className="font-medium text-base">{t.account}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dark Mode Toggle */}
          <div className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                <Moon className="w-5 h-5" />
              </div>
              <span className="font-medium text-base">{t.darkMode}</span>
            </div>
            <Switch checked={isDark} onCheckedChange={handleDarkToggle} />
          </div>

          {/* Language Selector */}
          <div className="w-full flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent text-accent-foreground">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium text-base">{t.language}</span>
            </div>
            <Select value={lang} onValueChange={(v) => setLang(v as "th" | "en")}>
              <SelectTrigger className="w-[120px] h-9 bg-transparent border-none focus:ring-0 text-right pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="th">ภาษาไทย</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
