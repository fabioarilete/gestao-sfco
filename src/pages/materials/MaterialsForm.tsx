import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { Controller, useForm } from 'react-hook-form';
import { MaterialsService } from './MaterialsService';
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
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IMaterialForm>({
    defaultValues: {
      id: '',
      name: '',
      price: 0, // Corrigido para número
      unit: '',
    },
  });

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      MaterialsService.getById(id).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
          navigate('/materials');
        } else {
          setValue('id', res.id);
          setValue('name', res.name);
          setValue('price', res.price);
          setValue('unit', res.unit);
          setName(res.name);
        }
      });
    }
  }, [id, navigate, setValue]);

  function handleSave(data: IMaterialForm) {
    setIsLoading(true);
    if (id === 'novo') {
      MaterialsService.create(data).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/materials');
        }
      });
    } else {
      MaterialsService.updateById(id, { ...data }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/materials');
        }
      });
    }
  }

  function handleCreateMaterial(data: IMaterialForm) {
    handleSave(data);
    setName(data.name);
    alert(`${data.name} foi cadastrado com sucesso!`);
  }

  function handleDelete(id: string) {
    if (confirm('Deseja realmente apagar esse material?')) {
      MaterialsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          alert('Material apagado com sucesso!');
          navigate('/materials');
        }
      });
    }
  }

  return (
    <LayoutBase
      titulo={id === 'novo' ? 'Novo Material' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Novo"
          showNewButton={id !== 'novo'}
          showDeleteButton={id !== 'novo'}
          clickingInSave={handleSubmit(handleCreateMaterial)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => navigate('/materials/detalhe/novo')}
          clickingInBack={() => navigate('/materials')}
        />
      }
    >
      <form onSubmit={handleSubmit(handleCreateMaterial)}>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
              <Typography variant="h5">Material</Typography>
              <Typography variant="caption">Cadastre seu material</Typography>
            </Grid>
            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Descrição do Material</InputLabel>
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

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Preço</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('price', {
                    required: 'Preço é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O preço não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
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
                      fullWidth
                      labelId="categoria-label"
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
          </Grid>
        </Box>
      </form>
    </LayoutBase>
  );
};
