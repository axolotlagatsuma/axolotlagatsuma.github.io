import { cn } from "@/lib/utils";

interface BlueprintContainerProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  metaRight?: string;
}

const BlueprintContainer = ({ children, className, label, metaRight }: BlueprintContainerProps) => {
  return (
    <div className={cn("relative border border-border rounded-none p-6", className)}>
      {/* Corner crosshairs */}
      <span className="absolute -top-[8px] -left-[8px] text-cyan-dim text-[10px] leading-none font-mono select-none">+</span>
      <span className="absolute -top-[8px] -right-[8px] text-cyan-dim text-[10px] leading-none font-mono select-none">+</span>
      <span className="absolute -bottom-[8px] -left-[8px] text-cyan-dim text-[10px] leading-none font-mono select-none">+</span>
      <span className="absolute -bottom-[8px] -right-[8px] text-cyan-dim text-[10px] leading-none font-mono select-none">+</span>
      
      {/* Leader line overshoots */}
      <span className="absolute -top-px -left-[15px] w-[15px] h-px bg-border" />
      <span className="absolute -top-px -right-[15px] w-[15px] h-px bg-border" />
      <span className="absolute -bottom-px -left-[15px] w-[15px] h-px bg-border" />
      <span className="absolute -bottom-px -right-[15px] w-[15px] h-px bg-border" />
      <span className="absolute -left-px -top-[15px] w-px h-[15px] bg-border" />
      <span className="absolute -right-px -top-[15px] w-px h-[15px] bg-border" />
      <span className="absolute -left-px -bottom-[15px] w-px h-[15px] bg-border" />
      <span className="absolute -right-px -bottom-[15px] w-px h-[15px] bg-border" />

      {/* Label */}
      {label && (
        <span className="absolute -top-3 left-4 bg-background px-2 text-[10px] text-muted-foreground tracking-widest uppercase">
          {label}
        </span>
      )}
      {metaRight && (
        <span className="absolute -top-3 right-4 bg-background px-2 text-[10px] text-muted-foreground tracking-widest uppercase">
          {metaRight}
        </span>
      )}

      {/* Corner degree notations */}
      <span className="absolute top-1 left-1 text-[8px] text-muted-foreground select-none">90.0°</span>
      <span className="absolute bottom-1 right-1 text-[8px] text-muted-foreground select-none">0.0°</span>

      {children}
    </div>
  );
};

export default BlueprintContainer;
