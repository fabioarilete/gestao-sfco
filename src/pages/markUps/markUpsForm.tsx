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
  }, [id, navigate, setValue]);

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
          clickingInNew={() => navigate('/markUps/detalhe/novo')}
          clickingInBack={() => navigate('/markUps')}
        />
      }
    >
      <form onSubmit={handleSubmit(handleCreateMarkUp)}>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
              <Typography variant="h5">Mark Up</Typography>
              <Typography variant="caption">Cadastre seu Mark Up</Typography>
            </Grid>
            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Descrição do Mark Up</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="text"
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} direction="row" padding={2} spacing={2}>
              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Impostos</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('taxes', {
                    required: 'Imposto é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.taxes}
                  helperText={errors.taxes?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Administração</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('admin', {
                    required: 'Administração é obrigatória',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.admin}
                  helperText={errors.admin?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Comissão</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('commission', {
                    required: 'Comissão é obrigatória',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.commission}
                  helperText={errors.commission?.message}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} direction="row" padding={2} spacing={2}>
              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Frete</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('freight', {
                    required: 'Frete é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.freight}
                  helperText={errors.freight?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Financeiro</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('financial', {
                    required: 'Financeiro é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.financial}
                  helperText={errors.financial?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Marketing</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('marketing', {
                    required: 'Marketing é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.marketing}
                  helperText={errors.marketing?.message}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} direction="row" padding={2} spacing={2}>
              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Promotores</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('promoters', {
                    required: 'Promotores é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.promoters}
                  helperText={errors.promoters?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Bonificações</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('bonus', {
                    required: 'Bonificações é obrigatória',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.bonus}
                  helperText={errors.bonus?.message}
                />
              </Grid>

              <Grid item xs={4} sm={4} md={2}>
                <InputLabel>Lucro</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('profit', {
                    required: 'Lucro é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.profit}
                  helperText={errors.profit?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LayoutBase>
  );
};
