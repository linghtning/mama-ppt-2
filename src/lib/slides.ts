import { BG_IMAGES } from '../constants.ts';
import type { PresenterRecord, SlideData } from '../types.ts';

export function buildSlides(presenter: PresenterRecord | null): SlideData[] {
  const reportData = presenter?.reportData;

  return [
    {
      id: 'title',
      title: `${presenter?.personName || '未命名演讲人'} 工作汇报`,
      type: 'title',
      bgImage: BG_IMAGES.TITLE,
    },
    {
      id: 'agenda',
      title: '目录',
      type: 'agenda',
      bgImage: BG_IMAGES.AGENDA,
    },
    {
      id: 'completion',
      title: '01 上周工作完成情况',
      content: reportData?.lastWeekCompletion || '',
      type: 'content',
      bgImage: BG_IMAGES.COMPLETION,
    },
    {
      id: 'plan',
      title: '02 本周工作计划',
      content: reportData?.thisWeekPlan || '',
      type: 'content',
      bgImage: BG_IMAGES.PLAN,
    },
    {
      id: 'data',
      title: '03 数据支持',
      content: reportData?.dataSupport || '',
      type: 'content',
      bgImage: BG_IMAGES.DATA,
    },
    {
      id: 'problems',
      title: '04 问题反馈',
      content: reportData?.problems || '',
      type: 'content',
      bgImage: BG_IMAGES.PROBLEMS,
    },
    {
      id: 'others',
      title: '05 其他补充',
      content: reportData?.others || '',
      type: 'content',
      bgImage: BG_IMAGES.OTHERS,
    },
    {
      id: 'end',
      title: '汇报完毕',
      type: 'end',
      bgImage: BG_IMAGES.END,
    },
  ];
}
