import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Star, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Recipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  description: string | null;
  ingredients: string[];
  instructions: string | null;
  rating: number;
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        toast.error("Recipe not found");
        navigate("/recipes");
        return;
      }
      const ingredients = Array.isArray(data.ingredients)
        ? (data.ingredients as string[])
        : [];
      setRecipe({ ...data, ingredients, rating: Number(data.rating) });
      setLoading(false);
    };
    fetch();
  }, [id]);

  // Check favorite & saved status
  useEffect(() => {
    if (!user || !id) return;
    const checkStatus = async () => {
      const [favRes, savedRes] = await Promise.all([
        supabase
          .from("user_favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("recipe_id", id)
          .maybeSingle(),
        supabase
          .from("user_saved_recipes")
          .select("id")
          .eq("user_id", user.id)
          .eq("recipe_id", id)
          .maybeSingle(),
      ]);
      setIsFavorite(!!favRes.data);
      setIsSaved(!!savedRes.data);
    };
    checkStatus();
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user || !id) return;
    if (isFavorite) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("recipe_id", id);
      setIsFavorite(false);
      toast.success("ลบออกจากรายการโปรด");
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, recipe_id: id });
      setIsFavorite(true);
      toast.success("เพิ่มในรายการโปรด");
    }
  };

  const toggleSaved = async () => {
    if (!user || !id) return;
    if (isSaved) {
      await supabase.from("user_saved_recipes").delete().eq("user_id", user.id).eq("recipe_id", id);
      setIsSaved(false);
      toast.success("ลบออกจากรายการ");
    } else {
      await supabase.from("user_saved_recipes").insert({ user_id: user.id, recipe_id: id });
      setIsSaved(true);
      toast.success("เพิ่มในรายการเมนู");
    }
  };

  if (loading || !recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={recipe.image_url || ""}
          alt={recipe.name}
          className="w-full h-56 sm:h-72 object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-background/70 backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/70 backdrop-blur-sm"
        >
          <Heart
            className={`h-6 w-6 transition-colors ${
              isFavorite ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </button>
      </div>

      <main className="container max-w-lg mx-auto px-5 -mt-6 relative z-10">
        <div className="rounded-2xl bg-card p-5 shadow-soft space-y-4">
          {/* Title & rating */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h1 className="font-display text-2xl font-bold text-foreground">{recipe.name}</h1>
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                {recipe.category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= recipe.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{recipe.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-muted-foreground">{recipe.description}</p>
          )}

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-body text-base font-semibold text-foreground">วัตถุดิบ</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions && (
            <div className="space-y-2">
              <h2 className="font-body text-base font-semibold text-foreground">วิธีทำ</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{recipe.instructions}</p>
            </div>
          )}

          {/* Add to list button */}
          <Button
            variant="warm"
            size="lg"
            className="w-full h-14 rounded-xl gap-2"
            onClick={toggleSaved}
          >
            {isSaved ? (
              <>
                <Check className="h-5 w-5" />
                เพิ่มในรายการแล้ว
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                เพิ่มในรายการเมนู
              </>
            )}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default RecipeDetail;
