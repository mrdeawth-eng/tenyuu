import { useState } from "react";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ExpiringAlert from "@/components/ExpiringAlert";
import RecipeItem from "@/components/RecipeItem";

import padkrapaoImg from "@/assets/recipe-padkrapao.jpg";
import curryImg from "@/assets/recipe-curry.jpg";

const expiringItems = [
  { name: "ไข่ไก่", expiryDate: "21/03/2026", daysLeft: 15 },
  { name: "นมสด", expiryDate: "29/03/2026", daysLeft: 21 },
];

const recommendedRecipes = [
  { image: padkrapaoImg, title: "ข้าวผัดหมู", category: "ผัด", rating: 3.0 },
];

const historyRecipes = [
  { image: padkrapaoImg, title: "ข้าวผัดหมู", category: "ผัด", rating: 3.0 },
];

const Recipes = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
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

        {/* Expiring Ingredients */}
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
            {recommendedRecipes.map((recipe, i) => (
              <RecipeItem key={i} {...recipe} />
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="font-body text-base font-semibold text-foreground mb-3">
            ประวัติการค้นหา (History)
          </h2>
          <div className="space-y-3">
            {historyRecipes.map((recipe, i) => (
              <RecipeItem key={i} {...recipe} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Recipes;
