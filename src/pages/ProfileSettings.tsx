import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Moon, Globe, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("th");

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleDarkToggle = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-5 h-16">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold">Setting</h1>
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
              <span className="font-medium text-base">Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dark Mode Toggle */}
          <div className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                <Moon className="w-5 h-5" />
              </div>
              <span className="font-medium text-base">Dark mode</span>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={handleDarkToggle}
            />
          </div>

          {/* Language Selector */}
          <div className="w-full flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent text-accent-foreground">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium text-base">Language</span>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px] h-9 bg-transparent border-none focus:ring-0 text-right pr-2">
                <SelectValue placeholder="Select language" />
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
