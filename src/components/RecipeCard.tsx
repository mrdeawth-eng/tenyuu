import { useState } from "react";
import { Heart, Clock } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  category: string;
  time: string;
  image: string;
  likes: number;
}

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group rounded-xl overflow-hidden bg-card shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              liked ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground">{recipe.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
            {recipe.category}
          </span>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.time}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {liked ? recipe.likes + 1 : recipe.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
