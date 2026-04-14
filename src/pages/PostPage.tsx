import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import BlueprintContainer from "@/components/BlueprintContainer";
import BarcodeSvg from "@/components/BarcodeSvg";
import TerminalButton from "@/components/TerminalButton";
import { fetchPost, type Post } from "@/data/posts";

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
          <BlueprintContainer key={`code-${i}`} label="CODE_BLOCK" className="my-4 bg-background">
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

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith("> ")) {
      inBlockquote = true;
      blockquoteLines.push(line.slice(2));
      continue;
    } else {
      flushBlockquote();
    }

    if (line.startsWith("## ")) {
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

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost(id).then((p) => {
        setPost(p);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">DECRYPTING_ARCHIVE...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground">FILE_NOT_FOUND</h1>
          <p className="text-muted-foreground mt-4">Archive entry does not exist or has been redacted.</p>
          <TerminalButton to="/" className="mt-6">RETURN_TO_REGISTRY</TerminalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> BACK_TO_REGISTRY
        </Link>

        <BlueprintContainer label={`ARCHIVE_ENTRY :: ${post.id}`} metaRight={post.date}>
          <div className="space-y-6 py-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground glow-text">{post.title}</h1>
                <div className="flex items-center gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="border border-border px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <BarcodeSvg id={post.id} />
            </div>

            <hr className="border-border" />

            <div className="space-y-1">
              {renderMarkdown(post.content)}
            </div>

            <hr className="border-border" />

            <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>END_OF_TRANSMISSION // {post.id}</span>
              <span><FileText size={10} className="inline" /> ARCHIVED</span>
            </div>
          </div>
        </BlueprintContainer>
      </div>
    </div>
  );
};

export default PostPage;
