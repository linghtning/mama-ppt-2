/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import agendaBg from './assets/backgrounds/agenda.jpg';
import completionBg from './assets/backgrounds/completion.jpg';
import dataBg from './assets/backgrounds/data.jpg';
import endBg from './assets/backgrounds/end.jpg';
import othersBg from './assets/backgrounds/others.jpg';
import planBg from './assets/backgrounds/plan.jpg';
import problemsBg from './assets/backgrounds/problems.jpg';
import titleBg from './assets/backgrounds/title.jpg';
import { PresentationStore, PresenterRecord, ReportData } from './types.ts';

export const BG_IMAGES = {
  TITLE: titleBg,
  AGENDA: agendaBg,
  COMPLETION: completionBg,
  PLAN: planBg,
  DATA: dataBg,
  PROBLEMS: problemsBg,
  OTHERS: othersBg,
  END: endBg,
};

export const INITIAL_REPORT_DATA: ReportData = {
  weekNumber: '',
  lastWeekCompletion: '',
  thisWeekPlan: '',
  dataSupport: '',
  problems: '',
  others: '',
};

export const STORE_KEY = 'mama-ppt-presentation-store';
export const LEGACY_REPORT_KEY = 'yiruit-report-data';
export const THEME_KEY = 'yiruit-theme';

export function createEmptyReportData(): ReportData {
  return { ...INITIAL_REPORT_DATA };
}

export function createPresenterRecord(name = '未命名演讲人'): PresenterRecord {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    personName: name,
    position: '',
    department: '',
    reportData: createEmptyReportData(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultStore(): PresentationStore {
  return {
    presenters: [],
    activePresenterId: null,
  };
}

export function createDefaultDemoStore(): PresentationStore {
  const presenter = createPresenterRecord('默认演示人');
  presenter.department = '业务部';
  presenter.position = '演示汇报';
  presenter.reportData = {
    weekNumber: '17',
    lastWeekCompletion: [
      '完成重点客户拜访与需求整理',
      '推进包装方案报价与样品确认',
      '同步本周订单进度并跟进异常问题',
    ].join('\n'),
    thisWeekPlan: [
      '继续跟进重点客户打样反馈',
      '整理下周客户沟通计划',
      '完善业务数据与汇报材料',
    ].join('\n'),
    dataSupport: [
      '本周跟进客户 12 家',
      '新增有效需求 5 条',
      '重点订单推进完成率 90%',
    ].join('\n'),
    problems: [
      '部分客户需求变更较快，需要更及时同步',
      '个别样品确认周期偏长，影响后续报价节奏',
    ].join('\n'),
    others: [
      '建议演示前先导入真实 Excel 数据替换默认内容',
    ].join('\n'),
  };

  return {
    presenters: [presenter],
    activePresenterId: presenter.id,
  };
}
