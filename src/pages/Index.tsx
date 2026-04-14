import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Signal, Archive, FileText, Lock, Unlock, ShieldAlert } from "lucide-react";
import BlueprintContainer from "@/components/BlueprintContainer";
import SignalWave from "@/components/SignalWave";
import BarcodeSvg from "@/components/BarcodeSvg";
import TerminalButton from "@/components/TerminalButton";
import { fetchAllPosts, type Post } from "@/data/posts";

const securityColors: Record<string, string> = {
  UNCLASSIFIED: "border-foreground text-foreground",
  CLASSIFIED: "border-destructive text-destructive",
  RESTRICTED: "border-yellow-500 text-yellow-500",
};

const securityIcons: Record<string, React.ReactNode> = {
  UNCLASSIFIED: <Unlock size={10} />,
  CLASSIFIED: <Lock size={10} />,
  RESTRICTED: <ShieldAlert size={10} />,
};

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchAllPosts().then(setPosts);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 ${loaded ? "boot-sequence" : "opacity-0"}`}>
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="text-center text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
            ──── SCHEMATIC_VIEW // INITIALIZED ────
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">OPERATOR // ONLINE</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-none glow-text text-flicker">
              OPERATOR<br />_ARCHIVE
            </h1>
            <p className="mt-4 text-sm text-muted-foreground font-mono">
              &gt; AWAITING_INPUT <span className="cursor-blink">_</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-widest">
            <span className="flex items-center gap-1 text-muted-foreground"><Signal size={12} /> SIGNAL —</span>
            <span className="text-foreground font-bold">STRONG</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Archive size={12} /> ARCHIVE —</span>
            <span className="text-foreground">{posts.length}_FILES</span>
            <span className="flex items-center gap-1 text-muted-foreground"><FileText size={12} /> STATUS —</span>
            <span className="text-foreground">ENCRYPTED</span>
          </div>

          <BlueprintContainer label="SIGNAL_ARRAY // LIVE_FEED" metaRight="FIG.01">
            <SignalWave />
          </BlueprintContainer>
        </section>

        {/* Transmission Description */}
        <BlueprintContainer label="TRANSMISSION_DESC" metaRight="META.01">
          <div className="space-y-4 py-2">
            <p className="text-sm leading-relaxed text-foreground/80">
              A decrypted transmission from a technical monolith. This archive documents signal theory, system architecture, and the philosophy of structured information. All entries are classified by security protocol. Access is provisional.
            </p>
            <div className="flex items-center gap-4">
              <TerminalButton to="/">ACCESS_REGISTRY</TerminalButton>
              <span className="text-[10px] text-muted-foreground">// {posts.length} ENTRIES INDEXED</span>
            </div>
          </div>
        </BlueprintContainer>

        {/* Registry Section */}
        <section className="space-y-8">
          <div className="text-center">
            <div className="inline-block border border-border rounded-none px-6 py-2 text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
              REGISTRY // FILE_INDEX
            </div>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">SECTION // THE_REGISTRY</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">ARCHIVE_FEED</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-12 h-px bg-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">SORTED // DATE_DESC</span>
            </div>
          </div>

          {posts.map((post) => (
            <BlueprintContainer key={post.id} label="FILE_ENTRY" metaRight="SYS_NODE">
              <div className="space-y-4">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  ARCHIVE_ID :: {post.id} &nbsp; {post.date}
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Link to={`/post/${post.id}`}>
                      <h3 className="text-lg md:text-xl font-bold text-foreground hover:underline cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <BarcodeSvg id={post.id} />
                    <span className={`inline-flex items-center gap-1 border rounded-none px-2 py-1 text-[10px] uppercase tracking-widest ${securityColors[post.securityLevel]}`}>
                      {securityIcons[post.securityLevel]} {post.securityLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-muted-foreground" />
                    {post.tags.map((tag) => (
                      <span key={tag} className="border border-border rounded-none px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/post/${post.id}`} className="text-[11px] text-foreground uppercase tracking-widest hover:underline">
                    ACCESS_FILE →
                  </Link>
                </div>
              </div>
            </BlueprintContainer>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Index;
