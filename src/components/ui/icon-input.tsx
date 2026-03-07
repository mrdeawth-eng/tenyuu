import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <Icon className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <input
          className={cn(
            "flex h-14 w-full rounded-lg border border-input bg-card px-4 pl-12 text-base font-body text-foreground shadow-soft placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
IconInput.displayName = "IconInput";

export { IconInput };
