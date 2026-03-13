import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, ChevronRight, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiration_date: string | null;
  notes: string | null;
}

const Fridge = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchIngredients = async () => {
    // Disabled Supabase loading – show empty state
    setIngredients([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchIngredients();
  }, [user]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    const ids = Array.from(selected);
    const { error } = await supabase
      .from("fridge_ingredients")
      .delete()
      .in("id", ids);
    if (error) {
      toast.error("Failed to delete ingredients");
    } else {
      toast.success("Deleted successfully");
      setSelected(new Set());
      setSelecting(false);
      fetchIngredients();
    }
  };

  const formatQuantity = (qty: number, unit: string) => {
    if (unit === "piece") return `x ${qty}`;
    return `x ${qty} ${unit}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="pt-6 pb-4 px-5">
        <h1 className="text-2xl font-bold text-foreground">{t.fridgeTitle}</h1>
      </header>

      {/* Ingredient List */}
      <main className="container max-w-lg mx-auto px-5 space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">{t.loading}</p>
        ) : ingredients.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">{t.noIngredients}</p>
        ) : (
          ingredients.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-xl bg-card border border-border px-4 py-3 transition-colors ${
                selecting ? "cursor-pointer" : ""
              } ${selected.has(item.id) ? "ring-2 ring-ring bg-accent" : ""}`}
              onClick={() => {
                if (selecting) {
                  toggleSelect(item.id);
                } else {
                  navigate(`/fridge/edit/${item.id}`);
                }
              }}
            >
              <div className="flex items-center gap-3">
                {selecting && (
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selected.has(item.id)
                        ? "bg-foreground border-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selected.has(item.id) && (
                      <span className="text-background text-xs">✓</span>
                    )}
                  </div>
                )}
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {formatQuantity(item.quantity, item.unit)}
                </span>
                {!selecting && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {selecting ? (
            <>
              <Button
                variant="warm"
                size="lg"
                className="w-full h-14 rounded-xl"
                onClick={() => {
                  const selectedNames = ingredients
                    .filter((i) => selected.has(i.id))
                    .map((i) => i.name);
                  navigate("/recipes", { state: { selectedIngredients: selectedNames } });
                }}
                disabled={selected.size === 0}
              >
                <Check className="h-5 w-5 mr-2" />
                {t.confirmSelection}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="w-full h-14 rounded-xl"
                onClick={deleteSelected}
                disabled={selected.size === 0}
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {t.deleteSelected} ({selected.size})
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 rounded-xl"
                onClick={() => {
                  setSelecting(false);
                  setSelected(new Set());
                }}
              >
                {t.cancel}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="warm"
                size="lg"
                className="w-full h-14 rounded-xl"
                onClick={() => setSelecting(true)}
                disabled={ingredients.length === 0}
              >
                {t.selectIngredients}
              </Button>
              <Button
                variant="warm"
                size="lg"
                className="w-full h-14 rounded-xl"
                onClick={() => navigate("/fridge/add")}
              >
                <Plus className="h-5 w-5 mr-2" />
                {t.addIngredient}
              </Button>
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Fridge;
