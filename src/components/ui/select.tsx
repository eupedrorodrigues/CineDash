import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectContextType {
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={containerRef} className="relative inline-block w-full text-left">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used inside Select");

  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/40",
        className,
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50 transition-transform duration-200",
          ctx.open && "rotate-180 opacity-80",
        )}
      />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used inside Select");
  return (
    <span className="truncate">
      {ctx.value && ctx.value !== "all" ? ctx.value : placeholder}
    </span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used inside Select");

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = React.useState(false);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  const updateFades = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowTopFade(el.scrollTop > 4);
    setShowBottomFade(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  React.useEffect(() => {
    // rAF garante que o DOM foi pintado e scrollHeight está correto
    const id = requestAnimationFrame(updateFades);
    return () => cancelAnimationFrame(id);
  }, [updateFades]);

  if (!ctx.open) return null;

  return (
    <div className="select-content absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border/60 bg-popover text-popover-foreground shadow-lg">
      {showTopFade && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-popover to-transparent" />
      )}

      <div
        ref={scrollRef}
        className="select-scroll max-h-60 overflow-y-auto overscroll-contain p-1"
        onScroll={updateFades}
      >
        {children}
      </div>

      {showBottomFade && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-popover to-transparent" />
      )}
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used inside Select");

  const isSelected = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => {
        ctx.onValueChange?.(value);
        ctx.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-left hover:bg-accent hover:text-accent-foreground outline-none focus:bg-accent focus:text-accent-foreground",
        isSelected && "bg-accent/60 text-accent-foreground font-medium",
      )}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}
