import type { PresenterRecord } from '../types.ts';

type PresenterIdentity = Pick<PresenterRecord, 'department' | 'personName' | 'position'> | null;

export function formatPresenterDepartmentTitle(presenter: PresenterIdentity) {
  const department = presenter?.department.trim() || '未填写部门';
  return `${department} 工作汇报`;
}

export function formatPresenterBadge(presenter: PresenterIdentity) {
  if (!presenter) {
    return '未选择';
  }

  const position = presenter.position.trim();
  const personName = presenter.personName.trim() || '未选择';

  return [position, personName].filter(Boolean).join(' ');
}
