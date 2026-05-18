import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div data-testid="loader-component">
      <Loader2 className={cn("h-16 w-16 animate-spin", className)} />
    </div>
  );
};

export { Loader };
