import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, Heart, Settings, FileWarning, LogOut, ChevronRight, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface HistoryItem {
  id: string;
  recipe_id: string;
  recipes: {
    id: string;
    name: string;
    image_url: string | null;
    rating: number;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("search_history")
        .select(`id, recipe_id, recipes (id, name, image_url, rating)`)
        .eq("user_id", user.id)
        .order("searched_at", { ascending: false });

      if (!error && data) {
        const uniqueHistory = Array.from(
          new Map(data.map((item) => [item.recipe_id, item])).values()
        );
        setHistory(uniqueHistory as unknown as HistoryItem[]);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
      </header>
      
      <main className="container max-w-lg mx-auto px-5 mt-4 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-3 pt-4 pb-6">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-sm">
            <span className="font-display text-4xl font-bold text-primary">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-display font-semibold text-foreground">
              {user?.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-card shadow-soft overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history" className="border-b border-border/50">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <History className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-base">{t.history}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 pt-2">
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/recipe/${item.recipes.id}`)}
                        className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img src={item.recipes.image_url || ""} alt={item.recipes.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{item.recipes.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-3 w-3 ${star <= Number(item.recipes.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">{t.noHistory}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <button onClick={() => navigate("/profile/favorite")} className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive"><Heart className="w-5 h-5" /></div>
              <span className="font-medium text-base">{t.favorite}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button onClick={() => navigate("/profile/settings")} className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary text-secondary-foreground"><Settings className="w-5 h-5" /></div>
              <span className="font-medium text-base">{t.setting}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button onClick={() => navigate("/report")} className="w-full flex items-center justify-between px-5 py-4 border-b border-border/50 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent text-accent-foreground"><FileWarning className="w-5 h-5" /></div>
              <span className="font-medium text-base">{t.report}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button onClick={() => signOut()} className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/50 transition-colors text-destructive">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10"><LogOut className="w-5 h-5" /></div>
              <span className="font-medium text-base">{t.logout}</span>
            </div>
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
