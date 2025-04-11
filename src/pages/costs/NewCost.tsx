import { LayoutBase } from '../../shared/layouts';
import { ToolBarButtons } from '../../shared/components';
import { CostSheet } from './costSheets/CostSheet';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export const NewCost: React.FC = () => {
  const navigate = useNavigate();
  const costSheetRef = useRef<{ submitForm: () => void }>(null);

  return (
    <LayoutBase
      titulo="Novo Produto"
      toolBar={
        <ToolBarButtons
          textNewButton="Novo"
          showNewButton={false}
          showDeleteButton={true}
          clickingInSave={handleSubmit(handleSubmit)}
          // clickingInDelete={() => handleDelete(id)}

          clickingInBack={() => {
            navigate('/products');
          }}
        />
      }
    >
      <CostSheet />
    </LayoutBase>
  );
};
