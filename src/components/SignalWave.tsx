import { useEffect, useRef } from "react";

const SignalWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(52, 192, 235, 0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Wave 1
      ctx.strokeStyle = "rgba(52, 192, 235, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x * 0.02) + time) * 40 + Math.sin((x * 0.005) + time * 0.5) * 30;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2
      ctx.strokeStyle = "rgba(52, 192, 235, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.cos((x * 0.015) + time * 1.3) * 50 + Math.sin((x * 0.008) + time * 0.7) * 20;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = "rgba(52, 192, 235, 0.5)";
      ctx.font = "10px 'JetBrains Mono'";
      ctx.fillText("SIGNAL_ARRAY // LIVE_FEED", 10, 16);
      ctx.fillText("FIG.01", w - 50, 16);
      ctx.fillText("0.000", 10, h - 8);
      ctx.fillText("> 1.000s", w - 70, h - 8);

      // Peak marker
      const peakX = w * 0.6;
      const peakY = h / 2 + Math.sin((peakX * 0.02) + time) * 40 + Math.sin((peakX * 0.005) + time * 0.5) * 30;
      ctx.fillStyle = "rgba(52, 192, 235, 0.9)";
      ctx.beginPath(); ctx.arc(peakX, peakY, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillText("SIGNAL", peakX + 8, peakY - 8);

      time += 0.02;
      animId = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-[250px] md:h-[300px]" />;
};

export default SignalWave;
