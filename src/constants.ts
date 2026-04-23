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
