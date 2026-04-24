import { FileSpreadsheet } from 'lucide-react';
import { formatDateTime } from '../../lib/format.ts';
import type { PresenterRecord } from '../../types.ts';
import { InfoCard } from '../ui/InfoCard.tsx';
import { RuleCard } from '../ui/RuleCard.tsx';

type PresenterPreviewProps = {
  presenter: PresenterRecord;
};

export function PresenterPreview({ presenter }: PresenterPreviewProps) {
  return (
    <div className="grid h-full gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="theme-scrollbar min-h-0 overflow-y-auto rounded-[28px] border border-natural-border bg-white p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:bg-natural-sidebar/50">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-natural-olive/65">
              当前人员
            </p>
            <h2 className="mt-2 text-xl font-bold text-natural-olive">
              个人信息预览
            </h2>
          </div>
          <div className="rounded-2xl bg-natural-olive/10 p-3 text-natural-olive">
            <FileSpreadsheet size={20} />
          </div>
        </div>

        <div className="space-y-4">
          <InfoCard label="人员姓名" value={presenter.personName} />
          <InfoCard label="所属部门" value={presenter.department || '未填写'} />
          <InfoCard label="岗位 / 身份" value={presenter.position || '未填写'} />
          <InfoCard
            label="汇报周次"
            value={presenter.reportData.weekNumber || '未填写'}
          />
          <InfoCard
            label="最后导入时间"
            value={formatDateTime(presenter.updatedAt)}
          />
        </div>
      </section>

      <section className="theme-scrollbar min-h-0 overflow-y-auto rounded-[28px] border border-natural-border bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] dark:bg-natural-sidebar/50">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-natural-olive/65">
            导入规则
          </p>
          <h2 className="mt-2 text-2xl font-bold text-natural-olive">
            后台使用说明
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <RuleCard
            title="后台不可编辑"
            description="后台不再提供手工修改演讲信息，列表中的数据全部来自导入的 Excel。"
          />
          <RuleCard
            title="同名自动替换"
            description="再次导入同名人员的 Excel 时，会直接替换旧记录，不会重复新增。"
          />
          <RuleCard
            title="右侧只读预览"
            description="点击左侧人员后，右侧只显示该人员的个人信息，不提供编辑入口。"
          />
          <RuleCard
            title="前台固定播放"
            description="前台只播放后台当前选中的人员，进入演示后不能在前台切换其他人员。"
          />
        </div>

        <div className="mt-8 rounded-3xl bg-natural-bg/70 p-5 dark:bg-black/10">
          <p className="text-sm font-semibold text-natural-olive">Excel 流程</p>
          <p className="mt-3 text-sm leading-7 opacity-75">
            先导出单人 Excel 模板。模板里已经带了示例内容，直接覆盖示例即可；基础信息填写在前几列，多条演讲内容按你截图那样在同一列里向下逐行填写，导入时系统会自动合并。若后续要修改同一个人的演讲内容，请重新导入同名 Excel，系统会用新数据覆盖旧数据。
          </p>
        </div>
      </section>
    </div>
  );
}
