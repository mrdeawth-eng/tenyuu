import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Star, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Report = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (rating === 0 && !message.trim()) return;
    // Save locally (could persist to DB later)
    navigate("/report/success");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-5 h-16">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-accent active:bg-accent/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold">{t.reportTitle}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-5 py-10 flex flex-col items-center">
        {/* App name */}
        <h2 className="font-display text-3xl font-bold tracking-widest text-foreground mb-4">
          TENYUU
        </h2>

        {/* Star rating */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} type="button">
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Feedback textarea with submit icon */}
        <div className="w-full relative">
          <textarea
            className="w-full min-h-[140px] rounded-xl bg-card border border-border px-4 py-3 pr-12 text-sm font-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder={t.reportPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="absolute bottom-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            <CheckCircle className="h-6 w-6" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Report;
