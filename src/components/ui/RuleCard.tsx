type RuleCardProps = {
  title: string;
  description: string;
};

export function RuleCard({ title, description }: RuleCardProps) {
  return (
    <div className="rounded-3xl border border-natural-border bg-natural-bg/70 p-5 dark:bg-black/10">
      <p className="text-base font-semibold text-natural-olive">{title}</p>
      <p className="mt-3 text-sm leading-7 opacity-75">{description}</p>
    </div>
  );
}
