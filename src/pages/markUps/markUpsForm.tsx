import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { useForm } from 'react-hook-form';
import { Box, Grid, InputLabel, LinearProgress, Paper, TextField, Typography } from '@mui/material';
import { MarkUpsService } from './MarkUpsService';

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
    formState: { errors },
  } = useForm<IMarkUpsForm>({
    defaultValues: {
      name: '',
      taxes: '' as any,
      commission: '' as any,
      admin: '' as any,
      freight: '' as any,
      financial: '' as any,
      promoters: '' as any,
      marketing: '' as any,
      bonus: '' as any,
      profit: '' as any,
    },
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
      MarkUpsService.updateById(id, { ...data }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/markUps');
        }
      });
    }
  }

  function handleCreateMaterial(data: IMarkUpsForm) {
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
          clickingInSave={handleSubmit(handleCreateMaterial)}
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
