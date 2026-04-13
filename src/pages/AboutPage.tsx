import BlueprintContainer from "@/components/BlueprintContainer";
import { aboutContent } from "@/data/about";
import { User, Terminal } from "lucide-react";

const renderMarkdown = (content: string) => {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={`bq-${elements.length}`} className="border-l-2 border-foreground pl-4 my-4 text-foreground/70 italic">
          {blockquoteLines.map((l, i) => <p key={i}>{l}</p>)}
        </blockquote>
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <BlueprintContainer key={`code-${i}`} label="DATA_BLOCK" className="my-4 bg-background">
            <pre className="text-xs text-foreground/80 overflow-x-auto"><code>{codeLines.join("\n")}</code></pre>
          </BlueprintContainer>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushBlockquote();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) { codeLines.push(line); continue; }

    if (line.startsWith("> ")) {
      inBlockquote = true;
      blockquoteLines.push(line.slice(2));
      continue;
    } else { flushBlockquote(); }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-3xl md:text-4xl font-bold text-foreground glow-text mt-4 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 ml-4 my-1">
          <span className="text-foreground mt-0.5">›</span>
          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-border my-6" />);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-foreground/80 leading-relaxed my-2" dangerouslySetInnerHTML={{
          __html: line
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 text-foreground text-xs">$1</code>')
        }} />
      );
    }
  }
  flushBlockquote();
  return elements;
};

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <User size={16} className="text-foreground" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">SECTION // OPERATOR_DOSSIER</span>
        </div>

        <BlueprintContainer label="ABOUT :: OPERATOR" metaRight="CLEARANCE_REQ">
          <div className="space-y-1 py-2">
            {renderMarkdown(aboutContent)}
          </div>
        </BlueprintContainer>

        <div className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          <Terminal size={12} className="inline mr-2" />
          END_OF_DOSSIER // OPERATOR_ARCHIVE
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
