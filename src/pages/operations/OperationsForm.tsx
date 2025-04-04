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
      name: '',
      valor: '' as any,
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
          setValue('name', res.name);
          setValue('valor', res.valor);
          setValue('unit', res.unit);
          setValue('type', res.type);
          setName(res.name);
        }
      });
    }
  }, [id]);

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

  function handleCreateMaterial(data: IOperationForm) {
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
          alert('Operação apagado com sucesso!');
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
          clickingInSave={handleSubmit(handleCreateMaterial)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => {
            navigate('/operations/detalhe/nova');
          }}
          clickingInBack={() => {
            navigate('/operations');
          }}
        />
      }
    >
      <form>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid>
              <Typography variant="h5">Operação</Typography>
              <Typography variant="caption">Cadastre sua operação</Typography>
            </Grid>
            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Descrição da operação</InputLabel>
                <TextField
                  size="small"
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

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Valor</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('valor', { required: true, valueAsNumber: true })}
                />
                {errors?.valor?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Valor é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Unidade</InputLabel>

                <Controller
                  name="unit"
                  control={control}
                  rules={{ required: 'Unidade é obrigatória' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="categoria-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <MenuItem value="">Selecione a unidade</MenuItem>
                      <MenuItem value="UN">UN</MenuItem>
                      <MenuItem value="KG">KG</MenuItem>
                      <MenuItem value="DZ">DZ</MenuItem>
                      <MenuItem value="CX">CX</MenuItem>
                      <MenuItem value="PT">PT</MenuItem>
                      <MenuItem value="FD">FD</MenuItem>
                      <MenuItem value="FX">FX</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="LT">LT</MenuItem>
                      <MenuItem value="M2">M2</MenuItem>
                      <MenuItem value="M3">M3</MenuItem>
                    </Select>
                  )}
                />
                {errors?.unit?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Unidade é obrigatória!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Tipo</InputLabel>

                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Tipo é obrigatório' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="categoria-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <MenuItem value="">Selecione o tipo</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Injeção">Injeção</MenuItem>
                    </Select>
                  )}
                />
                {errors?.unit?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Tipo é obrigatório!
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
