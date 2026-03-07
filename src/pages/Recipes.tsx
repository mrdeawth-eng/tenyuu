import { useState } from "react";
import { Search, Heart, Clock, ChefHat, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconInput } from "@/components/ui/icon-input";
import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/contexts/AuthContext";

import ramenImg from "@/assets/recipe-ramen.jpg";
import pokeImg from "@/assets/recipe-poke.jpg";
import pastaImg from "@/assets/recipe-pasta.jpg";
import curryImg from "@/assets/recipe-curry.jpg";
import cakeImg from "@/assets/recipe-cake.jpg";
import salmonImg from "@/assets/recipe-salmon.jpg";

const categories = ["All", "Japanese", "Italian", "Thai", "Desserts", "Seafood"];

const recipes = [
  { id: 1, title: "Tonkotsu Ramen", category: "Japanese", time: "45 min", image: ramenImg, likes: 234 },
  { id: 2, title: "Salmon Poke Bowl", category: "Japanese", time: "20 min", image: pokeImg, likes: 189 },
  { id: 3, title: "Fresh Basil Pasta", category: "Italian", time: "30 min", image: pastaImg, likes: 312 },
  { id: 4, title: "Green Curry", category: "Thai", time: "35 min", image: curryImg, likes: 156 },
  { id: 5, title: "Chocolate Lava Cake", category: "Desserts", time: "25 min", image: cakeImg, likes: 421 },
  { id: 6, title: "Grilled Herb Salmon", category: "Seafood", time: "20 min", image: salmonImg, likes: 278 },
];

const Recipes = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-display text-2xl font-bold tracking-widest text-foreground">TENYUU</h1>
          <button
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <IconInput
          icon={Search}
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No recipes found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Recipes;
