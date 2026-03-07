import { useState } from "react";
import { Heart, Star, ChevronRight } from "lucide-react";

interface RecipeItemProps {
  image: string;
  title: string;
  category: string;
  rating: number;
}

const RecipeItem = ({ image, title, category, rating }: RecipeItemProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
      {/* Image */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground truncate pr-2">{title}</h3>
          <button
            onClick={() => setLiked(!liked)}
            className="flex-shrink-0"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                liked ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
          {category}
        </span>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= rating ? "fill-amber-400 text-amber-400" : "text-muted"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
};

export default RecipeItem;
