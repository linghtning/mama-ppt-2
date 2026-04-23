/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReportData {
  weekNumber: string;
  lastWeekCompletion: string;
  thisWeekPlan: string;
  dataSupport: string;
  problems: string;
  others: string;
}

export interface SlideData {
  id: string;
  title: string;
  content?: string;
  type: 'title' | 'agenda' | 'content' | 'end';
  bgImage: string;
}
