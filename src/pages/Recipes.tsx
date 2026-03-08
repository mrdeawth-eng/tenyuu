import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import ExpiringAlert from "@/components/ExpiringAlert";
import RecipeItem from "@/components/RecipeItem";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Recipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  rating: number;
}

const Recipes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [history, setHistory] = useState<Recipe[]>([]);
  const [searching, setSearching] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_favorites")
      .select("recipe_id")
      .eq("user_id", user.id);
    if (data) setFavoriteIds(new Set(data.map((d: any) => d.recipe_id)));
  }, [user]);

  // Fetch recommended (user saved + top rated)
  const fetchRecommended = useCallback(async () => {
    if (!user) return;
    // Get user saved recipe ids
    const { data: saved } = await supabase
      .from("user_saved_recipes")
      .select("recipe_id")
      .eq("user_id", user.id);
    const savedIds = saved?.map((s: any) => s.recipe_id) || [];

    if (savedIds.length > 0) {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .in("id", savedIds)
        .order("rating", { ascending: false })
        .limit(5);
      setRecommended(data || []);
    } else {
      // Show top rated if no saved
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .order("rating", { ascending: false })
        .limit(5);
      setRecommended(data || []);
    }
  }, [user]);

  // Fetch search history
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("search_history")
      .select("recipe_id, searched_at")
      .eq("user_id", user.id)
      .order("searched_at", { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      // Deduplicate
      const uniqueIds = [...new Set(data.map((d: any) => d.recipe_id))].slice(0, 5);
      const { data: recipes } = await supabase
        .from("recipes")
        .select("*")
        .in("id", uniqueIds);
      setHistory(recipes || []);
    } else {
      setHistory([]);
    }
  }, [user]);

  useEffect(() => {
    fetchRecommended();
    fetchHistory();
    fetchFavorites();
  }, [fetchRecommended, fetchHistory, fetchFavorites]);

  // Search recipes
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .ilike("name", `%${search.trim()}%`)
        .order("rating", { ascending: false })
        .limit(20);
      setSearchResults(data || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleRecipeClick = async (recipe: Recipe) => {
    // Add to search history
    if (user) {
      await supabase.from("search_history").insert({
        user_id: user.id,
        recipe_id: recipe.id,
      });
    }
    navigate(`/recipe/${recipe.id}`);
  };

  const toggleFavorite = async (recipeId: string) => {
    if (!user) return;
    const isFav = favoriteIds.has(recipeId);
    if (isFav) {
      await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(recipeId);
        return next;
      });
    } else {
      await supabase.from("user_favorites").insert({
        user_id: user.id,
        recipe_id: recipeId,
      });
      setFavoriteIds((prev) => new Set(prev).add(recipeId));
    }
  };

  const expiringItems = [
    { name: "ไข่ไก่", expiryDate: "21/03/2026", daysLeft: 15 },
    { name: "นมสด", expiryDate: "29/03/2026", daysLeft: 21 },
  ];

  const isSearching = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
      </header>

      <main className="container max-w-lg mx-auto px-5 space-y-6 mt-4">
        {/* Search */}
        <div className="relative flex items-center">
          <input
            className="flex h-14 w-full rounded-xl border border-border bg-card px-4 text-base font-body text-foreground shadow-soft placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all pr-12"
            placeholder="ค้นหาเมนู"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-3 h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors">
            <Search className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {isSearching ? (
          /* Search Results */
          <section>
            <h2 className="font-body text-base font-semibold text-foreground mb-3">
              ผลการค้นหา "{search}"
            </h2>
            {searching ? (
              <p className="text-muted-foreground text-center py-6">กำลังค้นหา...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">ไม่พบเมนู</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((recipe) => (
                  <RecipeItem
                    key={recipe.id}
                    image={recipe.image_url || ""}
                    title={recipe.name}
                    category={recipe.category}
                    rating={Number(recipe.rating)}
                    liked={favoriteIds.has(recipe.id)}
                    onLikeToggle={() => toggleFavorite(recipe.id)}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Expiring */}
            <section>
              <h2 className="font-body text-base font-semibold text-foreground mb-3">
                วัตถุดิบใกล้หมดอายุ
              </h2>
              <ExpiringAlert items={expiringItems} />
            </section>

            {/* Recommended */}
            <section>
              <h2 className="font-body text-base font-semibold text-foreground mb-3">
                เมนูแนะนำ (Recommend)
              </h2>
              <div className="space-y-3">
                {recommended.map((recipe) => (
                  <RecipeItem
                    key={recipe.id}
                    image={recipe.image_url || ""}
                    title={recipe.name}
                    category={recipe.category}
                    rating={Number(recipe.rating)}
                    liked={favoriteIds.has(recipe.id)}
                    onLikeToggle={() => toggleFavorite(recipe.id)}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                ))}
              </div>
            </section>

            {/* History */}
            {history.length > 0 && (
              <section>
                <h2 className="font-body text-base font-semibold text-foreground mb-3">
                  ประวัติการค้นหา (History)
                </h2>
                <div className="space-y-3">
                  {history.map((recipe) => (
                    <RecipeItem
                      key={recipe.id}
                      image={recipe.image_url || ""}
                      title={recipe.name}
                      category={recipe.category}
                      rating={Number(recipe.rating)}
                      liked={favoriteIds.has(recipe.id)}
                      onLikeToggle={() => toggleFavorite(recipe.id)}
                      onClick={() => handleRecipeClick(recipe)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Recipes;
