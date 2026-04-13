import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TerminalButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}

const TerminalButton = ({ children, to, onClick, className, active }: TerminalButtonProps) => {
  const classes = cn(
    "inline-flex items-center gap-1 border border-foreground rounded-none px-4 py-2 text-xs uppercase tracking-widest font-mono transition-all",
    "hover:bg-foreground hover:text-primary-foreground",
    active && "bg-foreground text-primary-foreground",
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        <span className="text-muted-foreground">&lt;</span>
        <span>[ {children} ]</span>
        <span className="text-muted-foreground">&gt;</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      <span className="text-muted-foreground">&lt;</span>
      <span>[ {children} ]</span>
      <span className="text-muted-foreground">&gt;</span>
    </button>
  );
};

export default TerminalButton;
