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

export const INITIAL_REPORT_DATA = {
  weekNumber: '',
  lastWeekCompletion: '',
  thisWeekPlan: '',
  dataSupport: '',
  problems: '',
  others: '',
};
