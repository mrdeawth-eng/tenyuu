import { AlertTriangle } from "lucide-react";

interface ExpiringItem {
  name: string;
  expiryDate: string;
  daysLeft: number;
}

const ExpiringAlert = ({ items }: { items: ExpiringItem[] }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-start gap-3">
        {/* Warning icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>

        {/* Items */}
        <div className="flex gap-3 overflow-x-auto flex-1">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 rounded-xl px-4 py-3 min-w-[130px] ${
                item.daysLeft <= 15
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-muted"
              }`}
            >
              <p className={`text-base font-bold ${
                item.daysLeft <= 15 ? "text-destructive" : "text-foreground"
              }`}>
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                วัตถุดิบหมดอายุวันที่
              </p>
              <p className="text-xs text-muted-foreground">{item.expiryDate}</p>
              <p className={`text-xs font-semibold mt-1 ${
                item.daysLeft <= 15 ? "text-destructive" : "text-foreground"
              }`}>
                เหลือเวลาอีก {item.daysLeft} วัน
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpiringAlert;
