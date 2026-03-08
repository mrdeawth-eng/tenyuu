import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Recipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  rating: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from("user_favorites")
        .select("recipe_id")
        .eq("user_id", user.id);
      if (data && data.length > 0) {
        const ids = data.map((d: any) => d.recipe_id);
        const { data: recipes } = await supabase
          .from("recipes")
          .select("*")
          .in("id", ids);
        setFavorites(recipes || []);
      }
    };
    fetchFavorites();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
      </header>
      <main className="container max-w-lg mx-auto px-5 mt-8 space-y-6">
        {/* User info */}
        <div className="rounded-2xl bg-card p-6 shadow-soft text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-muted-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-foreground font-medium">{user?.email}</p>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <section>
            <h2 className="font-body text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 fill-destructive text-destructive" />
              รายการโปรด
            </h2>
            <div className="space-y-3">
              {favorites.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft cursor-pointer hover:bg-accent/30 transition-colors"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={recipe.image_url || ""}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-display text-base font-semibold text-foreground truncate">
                      {recipe.name}
                    </h3>
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {recipe.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= Number(recipe.rating) ? "fill-amber-400 text-amber-400" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Button
          variant="warm"
          size="lg"
          className="w-full h-14 rounded-xl gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
