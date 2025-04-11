import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { useForm } from 'react-hook-form';
import { Box, Grid, InputLabel, LinearProgress, Paper, TextField, Typography } from '@mui/material';
import { MarkUpsService } from './MarkUpsService';
import { UseMarkUpCoef } from './hooks/useMarkUpCoef';

interface IMarkUpsForm {
  id: string;
  name: string;
  taxes: number;
  commission: number;
  admin: number;
  freight: number;
  financial: number;
  promoters: number;
  marketing: number;
  bonus: number;
  profit: number;
  coef: number;
}

export const MarkUpsForm: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IMarkUpsForm>({
    defaultValues: {
      id: '',
      name: '',
      taxes: 0,
      commission: 0,
      admin: 0,
      freight: 0,
      financial: 0,
      promoters: 0,
      marketing: 0,
      bonus: 0,
      profit: 0,
      coef: 0,
    },
  });

  // Monitora os valores do formulário em tempo real
  const formValues = watch([
    'taxes',
    'commission',
    'admin',
    'freight',
    'financial',
    'promoters',
    'marketing',
    'bonus',
    'profit',
  ]);

  // Calcula o coeficiente com base nos valores atuais do formulário
  const coeficiente = UseMarkUpCoef({
    id: '',
    name: '',
    taxes: formValues[0] || 0,
    commission: formValues[1] || 0,
    admin: formValues[2] || 0,
    freight: formValues[3] || 0,
    financial: formValues[4] || 0,
    promoters: formValues[5] || 0,
    marketing: formValues[6] || 0,
    bonus: formValues[7] || 0,
    profit: formValues[8] || 0,
    coef: 0,
  });

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      MarkUpsService.getById(id).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
          navigate('/markUps');
        } else {
          setValue('id', res.id);
          setValue('name', res.name);
          setValue('taxes', res.taxes);
          setValue('admin', res.admin);
          setValue('commission', res.commission);
          setValue('freight', res.freight);
          setValue('financial', res.financial);
          setValue('marketing', res.marketing);
          setValue('bonus', res.bonus);
          setValue('promoters', res.promoters);
          setValue('profit', res.profit);
          setName(res.name);
        }
      });
    }
  }, [id]);

  function handleSave(data: IMarkUpsForm) {
    setIsLoading(true);
    if (id === 'novo') {
      MarkUpsService.create(data).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/markUps');
        }
      });
    } else {
      MarkUpsService.updateById(id, { ...data, coef: coeficiente }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/markUps');
        }
      });
    }
  }

  function handleCreateMarkUp(markUp: IMarkUpsForm) {
    const data = { ...markUp, coef: coeficiente };
    handleSave(data);
    setName(data.name);
    alert(`${data.name} foi cadastrado com sucesso!`);
  }
  function handleDelete(id: string) {
    if (confirm('Deseja realmente apagar esse markUp?')) {
      MarkUpsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          alert('MarkUp apagado com sucesso!');
          navigate('/markUps');
        }
      });
    }
  }

  return (
    <LayoutBase
      titulo={id === 'novo' ? 'Novo Mark Up' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Novo"
          showNewButton={id !== 'novo'}
          showDeleteButton={id !== 'novo'}
          clickingInSave={handleSubmit(handleCreateMarkUp)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => {
            navigate('/markUps/detalhe/novo');
          }}
          clickingInBack={() => {
            navigate('/markUps');
          }}
        />
      }
    >
      <form>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid>
              <Typography variant="h5">Mark Up</Typography>
              <Typography variant="caption">Cadastre seu Mark Up</Typography>
            </Grid>
            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Descrição do Material</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="text"
                  {...register('name', {
                    required: true,
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                />
                {errors?.name?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Nome é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container size={12} direction="row" padding={2} spacing={2}>
              <Grid size={2}>
                <InputLabel>Impostos</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('taxes', { required: true, valueAsNumber: true })}
                />
                {errors?.taxes?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Imposto é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Administração</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('admin', { required: true, valueAsNumber: true })}
                />
                {errors?.admin?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Administração é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Comissão</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('commission', { required: true, valueAsNumber: true })}
                />
                {errors?.commission?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Comissão é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container size={12} direction="row" padding={2} spacing={2}>
              <Grid size={2}>
                <InputLabel>Frete</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('freight', { required: true, valueAsNumber: true })}
                />
                {errors?.freight?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Frete é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Financeiro</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('financial', { required: true, valueAsNumber: true })}
                />
                {errors?.financial?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Financeiro é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Marketing</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('marketing', { required: true, valueAsNumber: true })}
                />
                {errors?.marketing?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Marketing é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container size={12} direction="row" padding={2} spacing={2}>
              <Grid size={2}>
                <InputLabel>Promotores</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('promoters', { required: true, valueAsNumber: true })}
                />
                {errors?.promoters?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Promotores é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Bonificações</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('bonus', { required: true, valueAsNumber: true })}
                />
                {errors?.bonus?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Bonificações é obrigatório!
                  </Typography>
                )}
              </Grid>

              <Grid size={2}>
                <InputLabel>Lucro</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('profit', { required: true, valueAsNumber: true })}
                />
                {errors?.profit?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Lucro é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LayoutBase>
  );
};
