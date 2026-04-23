import * as XLSX from 'xlsx';
import { PresenterRecord, ReportData } from './types.ts';

type FieldConfig = {
  label: string;
  key: keyof TemplateData;
  description: string;
};

type TemplateData = {
  personName: string;
  position: string;
  department: string;
  weekNumber: string;
  lastWeekCompletion: string;
  thisWeekPlan: string;
  dataSupport: string;
  problems: string;
  others: string;
};

type TemplateRow = {
  字段: string;
  内容: string;
};

export const TEMPLATE_FILE_NAME = '演讲人导入模板.xlsx';

const TEMPLATE_FIELDS: FieldConfig[] = [
  { label: '人员姓名', key: 'personName', description: '必填。导入后用于前台切换和演讲展示。' },
  { label: '岗位/身份', key: 'position', description: '例如：销售经理、项目负责人。' },
  { label: '所属部门', key: 'department', description: '例如：销售部、市场部。' },
  { label: '汇报周次', key: 'weekNumber', description: '例如：第17周。' },
  { label: '上周工作完成情况', key: 'lastWeekCompletion', description: '支持多条内容，单元格内可换行。' },
  { label: '本周工作计划', key: 'thisWeekPlan', description: '支持多条内容，单元格内可换行。' },
  { label: '数据支持', key: 'dataSupport', description: '可填写关键数字、里程碑、指标。' },
  { label: '问题反馈', key: 'problems', description: '填写当前风险、问题、待协助事项。' },
  { label: '其他补充', key: 'others', description: '填写其他说明。' },
];

const LABEL_TO_KEY = new Map(TEMPLATE_FIELDS.map((field) => [field.label, field.key]));

export function exportPresenterTemplate() {
  const templateRows: TemplateRow[] = TEMPLATE_FIELDS.map((field) => ({
    字段: field.label,
    内容: '',
  }));

  const templateSheet = XLSX.utils.json_to_sheet(templateRows);
  templateSheet['!cols'] = [{ wch: 22 }, { wch: 68 }];

  const guideSheet = XLSX.utils.json_to_sheet(
    TEMPLATE_FIELDS.map((field) => ({
      字段名称: field.label,
      填写说明: field.description,
    })),
  );

  guideSheet['!cols'] = [{ wch: 22 }, { wch: 68 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, templateSheet, '单人导入模板');
  XLSX.utils.book_append_sheet(workbook, guideSheet, '字段说明');
  XLSX.writeFile(workbook, TEMPLATE_FILE_NAME);
}

export async function importPresenterFromFile(file: File): Promise<PresenterRecord> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('Excel 文件中没有找到工作表。');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<TemplateRow>(sheet, {
    defval: '',
    raw: false,
  });

  const templateData = rows.reduce<TemplateData>(
    (acc, row) => {
      const fieldLabel = normalizeCellValue(row.字段);
      const key = LABEL_TO_KEY.get(fieldLabel);
      if (key) {
        acc[key] = normalizeCellValue(row.内容);
      }
      return acc;
    },
    {
      personName: '',
      position: '',
      department: '',
      weekNumber: '',
      lastWeekCompletion: '',
      thisWeekPlan: '',
      dataSupport: '',
      problems: '',
      others: '',
    },
  );

  if (!templateData.personName) {
    throw new Error('模板缺少“人员姓名”，请先填写后再导入。');
  }

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    personName: templateData.personName,
    position: templateData.position,
    department: templateData.department,
    createdAt: now,
    updatedAt: now,
    reportData: toReportData(templateData),
  };
}

function toReportData(data: TemplateData): ReportData {
  return {
    weekNumber: data.weekNumber,
    lastWeekCompletion: data.lastWeekCompletion,
    thisWeekPlan: data.thisWeekPlan,
    dataSupport: data.dataSupport,
    problems: data.problems,
    others: data.others,
  };
}

function normalizeCellValue(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace(/\r\n/g, '\n').trim();
}
