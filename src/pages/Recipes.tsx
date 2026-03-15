import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import ExpiringAlert from "@/components/ExpiringAlert";
import RecipeItem from "@/components/RecipeItem";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { differenceInDays, parseISO, format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface Recipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  rating: number;
  ingredients?: string[];
}

interface ExpiringItem {
  name: string;
  expiryDate: string;
  daysLeft: number;
}

const Recipes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);

  const selectedIngredients = location.state?.ingredients as string[] | undefined;

  const fetchExpiring = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("fridge_ingredients")
      .select("name, expiration_date")
      .eq("user_id", user.id)
      .not("expiration_date", "is", null);

    if (data) {
      const today = new Date();
      const items: ExpiringItem[] = data
        .map((item: any) => {
          const expDate = parseISO(item.expiration_date);
          const daysLeft = differenceInDays(expDate, today);
          return { name: item.name, expiryDate: format(expDate, "dd/MM/yyyy"), daysLeft };
        })
        .filter((item) => item.daysLeft >= 0 && item.daysLeft <= 3)
        .sort((a, b) => a.daysLeft - b.daysLeft);
      setExpiringItems(items);
    }
  }, [user]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("user_favorites").select("recipe_id").eq("user_id", user.id);
    if (data) setFavoriteIds(new Set(data.map((d: any) => d.recipe_id)));
  }, [user]);

  const fetchRecommended = useCallback(async () => {
    if (!user) return;

    if (selectedIngredients && selectedIngredients.length > 0) {
      const { data } = await supabase.from("recipes").select("*");
      if (data) {
        const filtered = data.filter((recipe) =>
          Array.isArray(recipe.ingredients) &&
          recipe.ingredients.some((ing) => selectedIngredients.includes(ing))
        ).sort((a, b) => b.rating - a.rating).slice(0, 5);
        setRecommended(filtered);
      }
    } else {
      const { data: saved } = await supabase.from("user_saved_recipes").select("recipe_id").eq("user_id", user.id);
      const savedIds = saved?.map((s: any) => s.recipe_id) || [];

      if (savedIds.length > 0) {
        const { data } = await supabase.from("recipes").select("*").in("id", savedIds).order("rating", { ascending: false }).limit(5);
        setRecommended(data || []);
      } else {
        const { data } = await supabase.from("recipes").select("*").order("rating", { ascending: false }).limit(5);
        setRecommended(data || []);
      }
    }
  }, [user, selectedIngredients]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("search_history").select("recipe_id, searched_at").eq("user_id", user.id).order("searched_at", { ascending: false }).limit(10);

    if (data && data.length > 0) {
      const uniqueIds = [...new Set(data.map((d: any) => d.recipe_id))].slice(0, 5);
      const { data: recipes } = await supabase.from("recipes").select("*").in("id", uniqueIds);
      setHistory(recipes || []);
    } else {
      setHistory([]);
    }
  }, [user]);

  useEffect(() => {
    fetchExpiring();
    fetchRecommended();
    fetchHistory();
    fetchFavorites();
  }, [fetchExpiring, fetchRecommended, fetchHistory, fetchFavorites]);

  const handleRecipeClick = async (recipe: Recipe) => {
    if (user) {
      await supabase.from("search_history").insert({ user_id: user.id, recipe_id: recipe.id });
    }
    navigate(`/recipe/${recipe.id}`);
  };

  const toggleFavorite = async (recipeId: string) => {
    if (!user) return;
    const isFav = favoriteIds.has(recipeId);
    if (isFav) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("recipe_id", recipeId);
      setFavoriteIds((prev) => { const next = new Set(prev); next.delete(recipeId); return next; });
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, recipe_id: recipeId });
      setFavoriteIds((prev) => new Set(prev).add(recipeId));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">TENYUU</h1>
      </header>

      <main className="container max-w-lg mx-auto px-5 space-y-6 mt-4">
        <div className="relative flex items-center cursor-pointer" onClick={() => navigate("/search")}>
          <div className="flex h-14 w-full rounded-xl border border-border bg-card px-4 text-base font-body text-muted-foreground shadow-soft items-center pr-12">
            {t.searchPlaceholder}
          </div>
          <div className="absolute right-3 h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
            <Search className="h-5 w-5 text-foreground" />
          </div>
        </div>

        <section>
          <h2 className="font-body text-base font-semibold text-foreground mb-3">{t.expiringTitle}</h2>
          {expiringItems.length > 0 ? (
            <ExpiringAlert items={expiringItems} />
          ) : (
            <p className="text-sm text-muted-foreground font-body">{t.noExpiring}</p>
          )}
        </section>

        <section>
          <h2 className="font-body text-base font-semibold text-foreground mb-3">{t.recommended}</h2>
          <div className="space-y-3">
            {recommended.map((recipe) => (
              <RecipeItem key={recipe.id} image={recipe.image_url || ""} title={recipe.name} category={recipe.category} rating={Number(recipe.rating)} liked={favoriteIds.has(recipe.id)} onLikeToggle={() => toggleFavorite(recipe.id)} onClick={() => handleRecipeClick(recipe)} />
            ))}
          </div>
        </section>

        {history.length > 0 && (
          <section>
            <h2 className="font-body text-base font-semibold text-foreground mb-3">{t.historyTitle}</h2>
            <div className="space-y-3">
              {history.map((recipe) => (
                <RecipeItem key={recipe.id} image={recipe.image_url || ""} title={recipe.name} category={recipe.category} rating={Number(recipe.rating)} liked={favoriteIds.has(recipe.id)} onLikeToggle={() => toggleFavorite(recipe.id)} onClick={() => handleRecipeClick(recipe)} />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Recipes;
