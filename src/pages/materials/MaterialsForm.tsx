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
          setValue('name', res.name);
          setValue('price', res.price);
          setValue('unit', res.unit);
          setName(res.name);
        }
      });
    } else {
      setValue('name', '');
      setValue('price', '' as any);
      setValue('unit', '');
    }
  }, [id]);

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
          clickingInNew={() => {
            navigate('/materials/detalhe/novo');
          }}
          clickingInBack={() => {
            navigate('/materials');
          }}
        />
      }
    >
      <form>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid>
              <Typography variant="h5">Material</Typography>
              <Typography variant="caption">Cadastre seu material</Typography>
            </Grid>
            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Descrição do Material</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="text"
                  {...register('name', { required: true })}
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
                <InputLabel>Preço</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('price', { required: true })}
                />
                {errors?.name?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Preço é obrigatório!
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
          </Grid>
        </Box>
      </form>
    </LayoutBase>
  );
};
