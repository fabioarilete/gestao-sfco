import { LayoutBase } from '../../shared/layouts';
import { ToolBarButtons } from '../../shared/components';

import { CostSheet } from './CostSheet';

export const CostsForm: React.FC = () => {
  return (
    <LayoutBase
      titulo="Custo"
      toolBar={<ToolBarButtons textNewButton="Novo" showNewButton={true} showDeleteButton={true} />}
    >
      <CostSheet />
    </LayoutBase>
  );
};
