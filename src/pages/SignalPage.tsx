import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, Volume2, Radio } from "lucide-react";
import BlueprintContainer from "@/components/BlueprintContainer";
import { signalConfig } from "@/data/signal";

const SignalPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(52, 192, 235, 0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Center line
    ctx.strokeStyle = "rgba(52, 192, 235, 0.15)";
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();

    // Waveform
    ctx.strokeStyle = "rgba(52, 192, 235, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const sliceWidth = w / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * h) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    // Glow
    ctx.strokeStyle = "rgba(52, 192, 235, 0.2)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * h) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = "rgba(52, 192, 235, 0.5)";
    ctx.font = "10px 'JetBrains Mono'";
    ctx.fillText("WAVEFORM_ANALYSIS // REAL-TIME", 10, 16);
    ctx.fillText("FIG.02", w - 50, 16);

    animRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const initAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceRef.current) return;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    initAudio();

    if (playing) {
      audio.pause();
      cancelAnimationFrame(animRef.current);
    } else {
      audio.play();
      drawWaveform();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Draw idle state
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "rgba(52, 192, 235, 0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(52, 192, 235, 0.15)";
      ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
      ctx.fillStyle = "rgba(52, 192, 235, 0.3)";
      ctx.font = "12px 'JetBrains Mono'";
      ctx.fillText("AWAITING_SIGNAL...", canvas.width / 2 - 80, canvas.height / 2 - 10);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => { setCurrentTime(audio.currentTime); setDuration(audio.duration || 0); };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("ended", () => { setPlaying(false); cancelAnimationFrame(animRef.current); });
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
    };
  }, []);

  const formatTime = (t: number) => {
    if (isNaN(t)) return "00:00";
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Radio size={16} className="text-foreground" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">SECTION // {signalConfig.title}</span>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground glow-text">{signalConfig.title}</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">{signalConfig.subtitle}</p>
        </div>

        <BlueprintContainer label="WAVEFORM_DISPLAY" metaRight="FIG.02">
          <canvas ref={canvasRef} className="w-full h-[300px] md:h-[400px]" />
        </BlueprintContainer>

        {/* Audio Controls */}
        <BlueprintContainer label="TRANSPORT_CONTROLS" metaRight="AUDIO_SYS">
          <div className="space-y-4 py-2">
            {signalConfig.audioUrl ? (
              <>
                <audio ref={audioRef} src={signalConfig.audioUrl} preload="metadata" crossOrigin="anonymous" />
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="border border-foreground rounded-none p-3 text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <div className="flex-1">
                    <div className="h-1 bg-muted rounded-none relative">
                      <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <Volume2 size={14} className="text-muted-foreground" />
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">NO_SIGNAL_LOADED</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Configure audio source in <code className="bg-muted px-1 py-0.5 text-foreground text-xs">src/data/signal.ts</code>
                </p>
              </div>
            )}
          </div>
        </BlueprintContainer>

        {/* Signal Metadata */}
        <BlueprintContainer label="SIGNAL_METADATA" metaRight="SPECS">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            {Object.entries(signalConfig.metadata).map(([key, val]) => (
              <div key={key}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{key}</p>
                <p className="text-sm text-foreground font-bold mt-1">{val}</p>
              </div>
            ))}
          </div>
        </BlueprintContainer>

        <p className="text-sm text-foreground/70 leading-relaxed">{signalConfig.description}</p>
      </div>
    </div>
  );
};

export default SignalPage;
