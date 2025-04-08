import { LayoutBase } from '../../shared/layouts';
import { ToolBarButtons } from '../../shared/components';
import { CostSheet } from './costSheets/CostSheet';
import { useNavigate } from 'react-router-dom';

export const NewCost: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LayoutBase
      titulo="Novo Produto"
      toolBar={
        <ToolBarButtons
          textNewButton="Novo"
          showNewButton={false}
          showDeleteButton={true}
          // clickingInSave={handleSubmit(handleCreateMaterial)}
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
