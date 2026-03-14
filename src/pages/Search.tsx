import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecipeItem from "@/components/RecipeItem";
import BottomNav from "@/components/BottomNav";
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

const CATEGORIES = ["ทอด", "ผัด", "ต้ม", "เส้น"];

const Search = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("user_favorites").select("recipe_id").eq("user_id", user.id);
    if (data) setFavoriteIds(new Set(data.map((d: any) => d.recipe_id)));
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  useEffect(() => {
    if (!search.trim()) { setSuggestions([]); return; }
    const timeout = setTimeout(async () => {
      const { data } = await supabase.from("recipes").select("name").ilike("name", `%${search.trim()}%`).limit(5);
      setSuggestions(data?.map((d) => d.name) || []);
    }, 200);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      let query = supabase.from("recipes").select("*").order("rating", { ascending: false }).limit(20);
      if (search.trim()) query = query.ilike("name", `%${search.trim()}%`);
      if (selectedCategories.length > 0) query = query.in("category", selectedCategories);
      const { data } = await query;
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleRecipeClick = async (recipe: Recipe) => {
    if (user) { await supabase.from("search_history").insert({ user_id: user.id, recipe_id: recipe.id }); }
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
      <header className="pt-6 pb-2 px-5 flex items-center gap-3">
        <button onClick={() => navigate("/recipes")} className="p-1"><ArrowLeft className="h-6 w-6 text-foreground" /></button>
        <div className="relative flex-1 flex items-center">
          <input className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-base font-body text-foreground shadow-soft placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all pr-12" placeholder={t.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
          <button className="absolute right-3 h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors">
            <SearchIcon className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-5 space-y-4 mt-2">
        {selectedCategories.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground font-body">{t.category} :</span>
            {selectedCategories.map((cat) => (
              <button key={cat} onClick={() => removeCategory(cat)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-foreground">
                {cat}<X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground font-body">{t.category} :</span>
            <div className="relative flex-1 flex items-center">
              <input className="flex h-9 w-full rounded-lg border border-border bg-card px-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder={t.searchCategory} readOnly />
              <SearchIcon className="absolute right-2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => toggleCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors border ${selectedCategories.includes(cat) ? "bg-foreground text-background border-foreground" : "bg-card text-foreground border-border hover:bg-accent"}`}>{cat}</button>
          ))}
        </div>

        {search.trim().length > 0 && suggestions.length > 0 && results.length === 0 && loading && (
          <div className="bg-card rounded-xl border border-border p-2 space-y-1">
            {suggestions.map((s, i) => (
              <button key={i} className="w-full text-left px-3 py-2 rounded-lg text-sm font-body text-foreground hover:bg-accent transition-colors" onClick={() => setSearch(s)}>{s}</button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground text-center py-6 font-body">{t.searching}</p>
        ) : results.length === 0 && (search.trim() || selectedCategories.length > 0) ? (
          <p className="text-muted-foreground text-center py-6 font-body">{t.noResults}</p>
        ) : (
          <div className="space-y-3">
            {results.map((recipe) => (
              <RecipeItem key={recipe.id} image={recipe.image_url || ""} title={recipe.name} category={recipe.category} rating={Number(recipe.rating)} liked={favoriteIds.has(recipe.id)} onLikeToggle={() => toggleFavorite(recipe.id)} onClick={() => handleRecipeClick(recipe)} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
