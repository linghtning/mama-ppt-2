type InfoCardProps = {
  label: string;
  value: string;
};

export function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-3xl border border-natural-border bg-natural-bg/70 p-4 dark:bg-black/10">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-natural-olive/60">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}
