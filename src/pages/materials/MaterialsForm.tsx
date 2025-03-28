import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { useForm } from 'react-hook-form';

interface IMaterialForm {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export const MaterialsForm: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IMaterialForm>();

  function handleCreateMaterial() {}
  function handleDelete() {}

  return (
    <LayoutBase
      titulo={id === 'novo' ? 'Novo Material' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Novo"
          showNewButton={id !== 'novo'}
          showDeleteButton={id !== 'novo'}
          clickingInSave={handleSubmit(handleCreateMaterial)()}
          clickingInDelete={() => handleDelete()}
          clickingInNew={() => {
            navigate('/materials/detalhe/novo');
          }}
          clickingInBack={() => {
            navigate('/materials');
          }}
        />
      }
    >
      <form></form>
    </LayoutBase>
  );
};
