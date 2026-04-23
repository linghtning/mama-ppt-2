import * as XLSX from 'xlsx';
import { PresenterRecord, ReportData } from './types.ts';

type FieldConfig = {
  label: string;
  key: keyof TemplateData;
  multiline: boolean;
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

type SheetRow = Array<string | number>;

export const TEMPLATE_FILE_NAME = '演讲人导入模板.xlsx';

const TEMPLATE_FIELDS: FieldConfig[] = [
  { label: '人员姓名', key: 'personName', multiline: false, description: '请直接覆盖示例内容，填写当前演讲人员姓名。' },
  { label: '岗位/身份', key: 'position', multiline: false, description: '例如：销售经理、测试负责人。' },
  { label: '所属部门', key: 'department', multiline: false, description: '例如：销售部、测试部。' },
  { label: '汇报周次', key: 'weekNumber', multiline: false, description: '例如：第17周。' },
  {
    label: '上周工作完成情况',
    key: 'lastWeekCompletion',
    multiline: true,
    description: '多条内容请在这一列继续向下填写，每行一条，直接覆盖示例即可。',
  },
  {
    label: '本周工作计划',
    key: 'thisWeekPlan',
    multiline: true,
    description: '多条内容请在这一列继续向下填写，每行一条，直接覆盖示例即可。',
  },
  {
    label: '数据支持',
    key: 'dataSupport',
    multiline: true,
    description: '多条内容请在这一列继续向下填写，每行一条，直接覆盖示例即可。',
  },
  {
    label: '问题反馈',
    key: 'problems',
    multiline: true,
    description: '多条内容请在这一列继续向下填写，每行一条，直接覆盖示例即可。',
  },
  {
    label: '其他补充',
    key: 'others',
    multiline: true,
    description: '多条内容请在这一列继续向下填写，每行一条，直接覆盖示例即可。',
  },
];

const EXAMPLE_VALUES: Record<keyof TemplateData, string[]> = {
  personName: ['示例：侯晓明'],
  position: ['示例：测试负责人'],
  department: ['示例：测试部'],
  weekNumber: ['示例：第17周'],
  lastWeekCompletion: [
    '示例：完成周报演示页面联调',
    '示例：修复前台翻页动画显示问题',
    '示例：整理本周测试结论并同步团队',
  ],
  thisWeekPlan: [
    '示例：完成 Excel 导入流程回归测试',
    '示例：跟进新版本演示脚本验证',
    '示例：补充异常场景测试记录',
  ],
  dataSupport: [
    '示例：本周累计验证 18 个功能点',
    '示例：发现并推动修复 4 个问题',
    '示例：演示流程通过率 100%',
  ],
  problems: [
    '示例：模板填写规范需要进一步统一',
    '示例：部分历史数据缺少周次信息',
  ],
  others: [
    '示例：建议演示前先确认后台当前选中人员',
  ],
};

const DEFAULT_ROW_COUNT = 8;
const EXAMPLE_PREFIX = '示例：';

export function exportPresenterTemplate() {
  const templateRows: SheetRow[] = [
    TEMPLATE_FIELDS.map((field) => field.label),
    ...buildExampleRows(),
  ];

  const templateSheet = XLSX.utils.aoa_to_sheet(templateRows);
  templateSheet['!cols'] = [
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 12 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
  ];
  templateSheet['!rows'] = [{ hpt: 24 }, ...Array.from({ length: DEFAULT_ROW_COUNT }, () => ({ hpt: 22 }))];
  templateSheet['!freeze'] = { xSplit: 0, ySplit: 1 };

  const guideSheet = XLSX.utils.json_to_sheet(
    TEMPLATE_FIELDS.map((field) => ({
      字段名称: field.label,
      填写方式: field.multiline ? '同列向下填写，多行自动合并' : '只需填写一格',
      说明: field.description,
    })),
  );
  guideSheet['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 56 }];

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
  const rows = XLSX.utils.sheet_to_json<SheetRow>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  const headerRow = rows[0]?.map((cell) => normalizeCellValue(cell)) ?? [];
  const dataRows = rows.slice(1);

  if (headerRow.length === 0) {
    throw new Error('Excel 模板缺少表头，请使用系统导出的模板。');
  }

  const templateData = TEMPLATE_FIELDS.reduce<TemplateData>(
    (acc, field) => {
      const columnIndex = headerRow.findIndex((header) => header === field.label);

      if (columnIndex === -1) {
        return acc;
      }

      acc[field.key] = field.multiline
        ? collectColumnLines(dataRows, columnIndex).join('\n')
        : getFirstNonEmptyValue(dataRows, columnIndex);

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
    throw new Error('模板缺少“人员姓名”，请先覆盖示例后再导入。');
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

function buildExampleRows() {
  return Array.from({ length: DEFAULT_ROW_COUNT }, (_, rowIndex) =>
    TEMPLATE_FIELDS.map((field) => EXAMPLE_VALUES[field.key][rowIndex] ?? ''),
  );
}

function collectColumnLines(rows: SheetRow[], columnIndex: number) {
  return rows.flatMap((row) =>
    normalizeCellValue(row[columnIndex])
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item && !isExampleValue(item)),
  );
}

function getFirstNonEmptyValue(rows: SheetRow[], columnIndex: number) {
  for (const row of rows) {
    const value = normalizeCellValue(row[columnIndex]);
    if (value && !isExampleValue(value)) {
      return value;
    }
  }

  return '';
}

function isExampleValue(value: string) {
  return value.startsWith(EXAMPLE_PREFIX);
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
