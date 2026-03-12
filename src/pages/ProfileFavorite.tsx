import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Star, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Recipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  rating: number;
}

const ProfileFavorite = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const { data } = await supabase.from("user_favorites").select("recipe_id").eq("user_id", user.id);
      if (data && data.length > 0) {
        const ids = data.map((d: any) => d.recipe_id);
        const { data: recipes } = await supabase.from("recipes").select("*").in("id", ids);
        setFavorites(recipes || []);
      }
    };
    fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-5 h-16">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold">{t.favorite}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-5 py-6">
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((recipe) => (
              <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft cursor-pointer hover:bg-accent/30 transition-colors">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  <img src={recipe.image_url || ""} alt={recipe.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-display text-base font-semibold text-foreground truncate">{recipe.name}</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= Number(recipe.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-2 text-destructive">
                  <Heart className="w-6 h-6 fill-destructive" />
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">{t.noFavorites}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileFavorite;
