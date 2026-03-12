import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Egg, CalendarDays, Scale, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const FridgeAdd = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("piece");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showUnits, setShowUnits] = useState(false);
  const [loading, setLoading] = useState(false);

  const UNITS = [
    { value: "piece", label: t.piece },
    { value: "g", label: t.gram },
    { value: "kg", label: t.kilogram },
    { value: "ml", label: t.milliliter },
    { value: "L", label: t.liter },
    { value: "mg", label: t.milligram },
  ];

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error(t.ingredientName); return; }
    if (!quantity || Number(quantity) <= 0) { toast.error(t.quantity); return; }
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.from("fridge_ingredients").insert({
      user_id: user.id, name: name.trim(), quantity: Number(quantity), unit,
      expiration_date: expirationDate || null, notes: notes.trim() || null,
    });
    if (error) { toast.error("Failed to add ingredient"); } else { toast.success("✓"); navigate("/fridge"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-4 px-5 flex items-center gap-3">
        <button onClick={() => navigate("/fridge")} className="text-foreground"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="text-2xl font-bold text-foreground">{t.addIngredientTitle}</h1>
      </header>

      <main className="container max-w-lg mx-auto px-5 space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3">
          <Egg className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input placeholder={t.ingredientName} value={name} onChange={(e) => setName(e.target.value)} className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" />
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input type="date" placeholder={t.expirationDate} value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 cursor-pointer" onClick={() => setShowUnits(!showUnits)}>
            <Scale className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input type="number" placeholder={t.quantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} onClick={(e) => e.stopPropagation()} className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" min="0" step="any" />
            <span className="text-xs text-muted-foreground">▲</span>
          </div>
          {showUnits && (
            <div className="px-2">
              <p className="text-xs text-muted-foreground mb-2">{t.selectUnit}</p>
              <div className="flex flex-wrap gap-2">
                {UNITS.map((u) => (
                  <button key={u.value} onClick={() => { setUnit(u.value); setShowUnits(false); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${unit === u.value ? "bg-foreground text-background" : "bg-card border border-border text-foreground hover:bg-accent"}`}>{u.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-card border border-border px-4 py-3">
          <StickyNote className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <Textarea placeholder={t.notes} value={notes} onChange={(e) => setNotes(e.target.value)} className="border-0 bg-transparent p-0 min-h-[60px] focus-visible:ring-0 text-foreground placeholder:text-muted-foreground resize-none" />
        </div>

        <Button variant="warm" size="lg" className="w-full h-14 rounded-xl mt-6" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : t.confirmAdd}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default FridgeAdd;
