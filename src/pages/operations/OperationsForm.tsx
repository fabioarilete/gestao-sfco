import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { OperationsService } from './OperationsService';

interface IOperationForm {
  id: string;
  name: string;
  valor: number;
  unit: string;
  type: string;
}

export const OperationsForm: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IOperationForm>({
    defaultValues: {
      id: '',
      name: '',
      valor: 0, // Corrigido para número
      unit: '',
      type: '',
    },
  });

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      OperationsService.getById(id).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
          navigate('/operations');
        } else {
          setValue('id', res.id);
          setValue('name', res.name);
          setValue('valor', res.valor);
          setValue('unit', res.unit);
          setValue('type', res.type);
          setName(res.name);
        }
      });
    }
  }, [id, navigate, setValue]);

  function handleSave(data: IOperationForm) {
    setIsLoading(true);
    if (id === 'nova') {
      OperationsService.create(data).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/operations');
        }
      });
    } else {
      OperationsService.updateById(id, { ...data }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/operations');
        }
      });
    }
  }

  function handleCreateOperation(data: IOperationForm) {
    handleSave(data);
    setName(data.name);
    alert(`${data.name} foi cadastrado com sucesso!`);
  }

  function handleDelete(id: string) {
    if (confirm('Deseja realmente apagar essa operação?')) {
      OperationsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          alert('Operação apagada com sucesso!');
          navigate('/operations');
        }
      });
    }
  }

  return (
    <LayoutBase
      titulo={id === 'nova' ? 'Nova Operação' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Nova"
          showNewButton={id !== 'nova'}
          showDeleteButton={id !== 'nova'}
          clickingInSave={handleSubmit(handleCreateOperation)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => navigate('/operations/detalhe/nova')}
          clickingInBack={() => navigate('/operations')}
        />
      }
    >
      <form onSubmit={handleSubmit(handleCreateOperation)}>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
              <Typography variant="h5">Operação</Typography>
              <Typography variant="caption">Cadastre sua operação</Typography>
            </Grid>
            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Descrição da Operação</InputLabel>
                <TextField
                  size="small"
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

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Valor</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('valor', {
                    required: 'Valor é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.valor}
                  helperText={errors.valor?.message}
                />
              </Grid>
            </Grid>

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Unidade</InputLabel>
                <Controller
                  name="unit"
                  control={control}
                  rules={{ required: 'Unidade é obrigatória' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="unit-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                      error={!!errors.unit}
                    >
                      <MenuItem value="">Selecione a unidade</MenuItem>
                      <MenuItem value="UN">Unidade</MenuItem>
                      <MenuItem value="KG">Quilograma</MenuItem>
                      <MenuItem value="CX">Caixa</MenuItem>
                      <MenuItem value="PT">Pacote</MenuItem>
                      <MenuItem value="LT">Litro</MenuItem>
                      <MenuItem value="HR">Hora</MenuItem>
                      <MenuItem value="FD">Fardo</MenuItem>
                      <MenuItem value="FX">Feixe</MenuItem>
                      <MenuItem value="M2">Metro Quadrado</MenuItem>
                      <MenuItem value="M3">Metro Cúbico</MenuItem>
                    </Select>
                  )}
                />
                {errors.unit && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    {errors.unit.message}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Tipo</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Tipo é obrigatório' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="type-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                      error={!!errors.type}
                    >
                      <MenuItem value="">Selecione o tipo</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Injeção">Injeção</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    {errors.type.message}
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
