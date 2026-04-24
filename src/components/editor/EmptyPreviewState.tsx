export function EmptyPreviewState() {
  return (
    <div className="rounded-[32px] border border-dashed border-natural-border bg-white/70 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:bg-white/5">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-natural-olive/65">
        Ready For Import
      </p>
      <h2 className="mt-4 font-serif text-3xl font-bold italic text-natural-olive">
        暂无可预览人员
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 opacity-75">
        后台不提供手工编辑。请导入 Excel 后查看人员列表，点击左侧某个人员，右侧会展示该人员的个人信息预览。
      </p>
    </div>
  );
}
