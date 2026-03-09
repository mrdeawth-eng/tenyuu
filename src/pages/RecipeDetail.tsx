import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Star, Plus, Check, Play, ChevronRight } from "lucide-react";
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
  video_url: string | null;
  description: string | null;
  ingredients: string[];
  instructions: string | null;
  rating: number;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface SimilarRecipe {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  rating: number;
}

type FlowState = "detail" | "review" | "success";

const StarRating = ({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
}) => {
  const cls = size === "lg" ? "h-8 w-8" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${cls} transition-colors ${
              star <= value ? "fill-amber-400 text-amber-400" : "text-muted"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similar, setSimilar] = useState<SimilarRecipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Review modal state
  const [flowState, setFlowState] = useState<FlowState>("detail");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("ไม่พบเมนูนี้");
        navigate("/recipes");
        return;
      }

      const ingredients = Array.isArray(data.ingredients) ? (data.ingredients as string[]) : [];
      setRecipe({
        ...data,
        ingredients,
        rating: Number(data.rating),
        video_url: (data as any).video_url ?? null,
      });

      // Fetch similar recipes (same category, different id)
      const { data: sim } = await supabase
        .from("recipes")
        .select("id, name, category, image_url, rating")
        .eq("category", data.category)
        .neq("id", id)
        .limit(3);
      setSimilar(sim || []);

      // Fetch reviews
      const { data: revData } = await supabase
        .from("recipe_reviews")
        .select("*")
        .eq("recipe_id", id)
        .order("created_at", { ascending: false })
        .limit(10);
      setReviews((revData as Review[]) || []);

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  // Check favorite & saved + fetch fav IDs for similar
  useEffect(() => {
    if (!user || !id) return;
    const checkStatus = async () => {
      const [favRes, savedRes, allFavsRes] = await Promise.all([
        supabase.from("user_favorites").select("id").eq("user_id", user.id).eq("recipe_id", id).maybeSingle(),
        supabase.from("user_saved_recipes").select("id").eq("user_id", user.id).eq("recipe_id", id).maybeSingle(),
        supabase.from("user_favorites").select("recipe_id").eq("user_id", user.id),
      ]);
      setIsFavorite(!!favRes.data);
      setIsSaved(!!savedRes.data);
      if (allFavsRes.data) setFavoriteIds(new Set(allFavsRes.data.map((d: any) => d.recipe_id)));
    };
    checkStatus();
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user || !id) return;
    if (isFavorite) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("recipe_id", id);
      setIsFavorite(false);
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, recipe_id: id });
      setIsFavorite(true);
    }
  };

  const toggleSimilarFavorite = async (recipeId: string) => {
    if (!user) return;
    const isFav = favoriteIds.has(recipeId);
    if (isFav) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("recipe_id", recipeId);
      setFavoriteIds((prev) => { const n = new Set(prev); n.delete(recipeId); return n; });
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, recipe_id: recipeId });
      setFavoriteIds((prev) => new Set(prev).add(recipeId));
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

  const submitReview = async () => {
    if (!user || !id || reviewRating === 0) {
      toast.error("กรุณาเลือกคะแนน");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("recipe_reviews").insert({
      recipe_id: id,
      user_id: user.id,
      rating: reviewRating,
      comment: reviewComment || null,
    } as any);
    setSubmitting(false);
    if (error) {
      toast.error("ไม่สามารถบันทึกรีวิวได้");
      return;
    }
    setFlowState("success");
  };

  if (loading || !recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body">กำลังโหลด...</p>
      </div>
    );
  }

  // === SUCCESS SCREEN ===
  if (flowState === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 gap-8">
        <div className="rounded-2xl overflow-hidden w-48 h-48 shadow-soft">
          <img src={recipe.image_url || ""} alt={recipe.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-foreground">ทำอาหารเสร็จแล้ว!</h2>
          <p className="text-muted-foreground font-body text-sm">ขอบคุณสำหรับรีวิวของคุณ</p>
        </div>
        <Button
          className="w-full h-14 rounded-xl text-base font-semibold bg-success text-success-foreground hover:bg-success/90 border-0"
          onClick={() => navigate("/recipes")}
        >
          เสร็จสิ้น
        </Button>
      </div>
    );
  }

  // === REVIEW MODAL OVERLAY ===
  const ReviewModal = () => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="w-full max-w-lg bg-background rounded-t-3xl p-6 space-y-5 pb-10">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-2" />
        <h2 className="font-display text-xl font-bold text-foreground text-center">รีวิวเมนูนี้</h2>

        {/* Recipe info */}
        <div className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={recipe.image_url || ""} alt={recipe.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-body font-semibold text-foreground">{recipe.name}</p>
            <p className="text-xs text-muted-foreground font-body">{recipe.category}</p>
          </div>
        </div>

        {/* Star rating */}
        <div className="space-y-2">
          <p className="font-body text-sm font-medium text-foreground">ให้คะแนน</p>
          <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <p className="font-body text-sm font-medium text-foreground">ความคิดเห็น (ไม่บังคับ)</p>
          <textarea
            className="w-full h-24 rounded-xl border border-border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="เขียนความคิดเห็นของคุณ..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={() => setFlowState("detail")}
          >
            ยกเลิก
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90"
            onClick={submitReview}
            disabled={submitting || reviewRating === 0}
          >
            {submitting ? "กำลังบันทึก..." : "ส่งรีวิว"}
          </Button>
        </div>
      </div>
    </div>
  );

  // Parse instructions into steps
  const steps = recipe.instructions
    ? recipe.instructions.split(/\n|(?=\d+\.)/).filter((s) => s.trim())
    : [];

  return (
    <div className="min-h-screen bg-background pb-32">
      {flowState === "review" && <ReviewModal />}

      {/* Hero Image - full width, taller */}
      <div className="relative">
        <img
          src={recipe.image_url || ""}
          alt={recipe.name}
          className="w-full h-72 sm:h-80 object-cover"
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
          <Heart className={`h-6 w-6 transition-colors ${isFavorite ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>

      <main className="container max-w-lg mx-auto px-5 space-y-6 pt-5">
        {/* Title & Rating */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h1 className="font-display text-2xl font-bold text-foreground leading-tight">{recipe.name}</h1>
            <span className="flex-shrink-0 inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mt-1">
              {recipe.category}
            </span>
          </div>
          <StarRating value={recipe.rating} size="md" />
          <p className="text-sm text-muted-foreground font-body">{recipe.rating.toFixed(1)}</p>
        </div>

        {/* Add to list */}
        <Button variant="warm" size="lg" className="w-full h-12 rounded-xl gap-2" onClick={toggleSaved}>
          {isSaved ? (<><Check className="h-5 w-5" />เพิ่มในรายการแล้ว</>) : (<><Plus className="h-5 w-5" />เพิ่มในรายการเมนู</>)}
        </Button>

        {/* วัตถุดิบ */}
        {recipe.ingredients.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-body text-base font-semibold text-foreground">วัตถุดิบ</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                  {ing}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* วิธีทำ */}
        {recipe.instructions && (
          <section className="space-y-3">
            <h2 className="font-body text-base font-semibold text-foreground">วิธีทำ</h2>
            <div className="space-y-2">
              {steps.length > 1 ? (
                steps.map((step, i) => (
                  <div key={i} className="flex gap-3 text-sm font-body text-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-foreground font-body leading-relaxed">{recipe.instructions}</p>
              )}
            </div>
          </section>
        )}

        {/* Clip Video */}
        <section className="space-y-3">
          <h2 className="font-body text-base font-semibold text-foreground">Clip Video</h2>
          {recipe.video_url ? (
            <div className="rounded-2xl overflow-hidden aspect-video bg-muted">
              <iframe
                src={recipe.video_url}
                className="w-full h-full"
                allowFullScreen
                title={`${recipe.name} video`}
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-card border border-border aspect-video flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground ml-1" />
              </div>
              <p className="text-sm text-muted-foreground font-body">ยังไม่มีคลิปวิดีโอ</p>
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="font-body text-base font-semibold text-foreground">รีวิว</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">ยังไม่มีรีวิว</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl bg-card border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-muted-foreground font-semibold">
                        {rev.user_id.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground font-body">มือปราม</p>
                      <StarRating value={rev.rating} size="sm" />
                    </div>
                  </div>
                  {rev.comment && (
                    <p className="text-xs text-muted-foreground font-body leading-relaxed line-clamp-3">
                      {rev.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* เมนูใกล้เคียง */}
        {similar.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-body text-base font-semibold text-foreground">เมนูใกล้เคียง</h2>
            <div className="space-y-3">
              {similar.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => navigate(`/recipe/${s.id}`)}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={s.image_url || ""} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-body font-semibold text-foreground text-sm truncate">{s.name}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {s.category}
                    </span>
                    <StarRating value={Number(s.rating)} size="sm" />
                  </div>
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSimilarFavorite(s.id); }}
                      aria-label="Like"
                    >
                      <Heart className={`h-5 w-5 transition-colors ${favoriteIds.has(s.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                    </button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* เริ่มทำ button - write review after */}
        <div className="pb-4">
          <Button
            className="w-full h-14 rounded-xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90 border-0"
            onClick={() => { setReviewRating(0); setReviewComment(""); setFlowState("review"); }}
          >
            เริ่มทำ
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default RecipeDetail;
