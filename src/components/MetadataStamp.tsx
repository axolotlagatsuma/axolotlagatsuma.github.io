const MetadataStamp = () => {
  const now = new Date();
  const timestamp = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} // ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
      <span>DEPT: STRATEGIC_COORD</span>
      <span>STATUS: ENCRYPTION</span>
      <span>TIMESTAMP: {timestamp}</span>
    </div>
  );
};

export default MetadataStamp;
