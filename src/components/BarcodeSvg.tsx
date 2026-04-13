interface BarcodeSvgProps {
  id: string;
}

const BarcodeSvg = ({ id }: BarcodeSvgProps) => {
  // Generate deterministic bars from id
  const bars: number[] = [];
  for (let i = 0; i < 30; i++) {
    bars.push(id.charCodeAt(i % id.length) % 3 === 0 ? 3 : id.charCodeAt(i % id.length) % 2 === 0 ? 2 : 1);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="40" viewBox="0 0 80 40" className="text-foreground">
        {bars.map((w, i) => (
          <rect
            key={i}
            x={i * 2.5 + 2}
            y={2}
            width={w}
            height={36}
            fill="currentColor"
            opacity={0.7}
          />
        ))}
      </svg>
      <span className="text-[8px] text-muted-foreground tracking-widest">{id}</span>
    </div>
  );
};

export default BarcodeSvg;
