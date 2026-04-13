import { useLocation } from "react-router-dom";
import TerminalButton from "./TerminalButton";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-foreground font-bold">&gt;_ OPERATOR_ARCHIVE</span>
          <span className="text-muted-foreground">// SYS_ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <TerminalButton to="/" active={location.pathname === "/"}>REGISTRY</TerminalButton>
          <TerminalButton to="/signal" active={location.pathname === "/signal"}>SIGNAL</TerminalButton>
          <TerminalButton to="/about" active={location.pathname === "/about"}>ABOUT</TerminalButton>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-2 flex items-center justify-between">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
          DEPT: STRATEGIC_COORD &nbsp; STATUS: ENCRYPTION
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
          TIMESTAMP: {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')} // {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
