type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-natural-border bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] dark:bg-white/5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-natural-olive/60">
        {label}
      </p>
      <p className="mt-2 max-w-[180px] truncate text-lg font-semibold">{value}</p>
    </div>
  );
}
