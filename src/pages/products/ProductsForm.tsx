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
import { ProductsService } from './ProductsService';

interface IProductForm {
  id: string;
  cod: string;
  name: string;
  unit: string;
  qt: number;
  type: string;
  st: string;
  sf_st: string;
}

export const ProductsForm: React.FC = () => {
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
  } = useForm<IProductForm>({
    defaultValues: {
      cod: '',
      name: '',
      unit: '',
      qt: '' as any,
      type: '',
      st: '',
      sf_st: '',
    },
  });

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);

      ProductsService.getById(id).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
          navigate('/products');
        } else {
          setValue('cod', res.cod);
          setValue('name', res.name);
          setValue('unit', res.unit);
          setValue('qt', res.qt);
          setValue('type', res.type);
          setValue('st', res.st);
          setValue('sf_st', res.sf_st);
          setName(res.name);
        }
      });
    }
  }, [id]);

  function handleSave(data: IProductForm) {
    setIsLoading(true);
    if (id === 'novo') {
      ProductsService.create(data).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/products');
        }
      });
    } else {
      ProductsService.updateById(id, { ...data }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/products');
        }
      });
    }
  }

  function handleCreateMaterial(data: IProductForm) {
    handleSave(data);
    setName(data.name);
    alert(`${data.name} foi cadastrado com sucesso!`);
  }
  function handleDelete(id: string) {
    if (confirm('Deseja realmente apagar esse produto?')) {
      ProductsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          alert('Produto apagado com sucesso!');
          navigate('/products');
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
            navigate('/products/detalhe/novo');
          }}
          clickingInBack={() => {
            navigate('/products');
          }}
        />
      }
    >
      <form>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid>
              <Typography variant="h5">Produto</Typography>
              <Typography variant="caption">Cadastre seu produto</Typography>
            </Grid>
            <Grid container spacing={2} direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Código</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  type="text"
                  {...register('cod', {
                    required: true,
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                />
                {errors?.cod?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Código é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Descrição do Produto</InputLabel>
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

            <Grid container spacing={2} direction="row">
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}>
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
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}>
                <InputLabel>Quantidade</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('qt', { required: true, valueAsNumber: true })}
                />
                {errors?.qt?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Quantidade é obrigatória!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={2} direction="row">
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}>
                <InputLabel>Produzido?</InputLabel>
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
                      <MenuItem value="">Selecione a opção</MenuItem>
                      <MenuItem value="SIM">SIM</MenuItem>
                      <MenuItem value="NÃO">NÃO</MenuItem>
                    </Select>
                  )}
                />
                {errors?.type?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Resposta é obrigatória!
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}>
                <InputLabel>Tem ST?</InputLabel>
                <Controller
                  name="st"
                  control={control}
                  rules={{ required: 'Resposta é obrigatória' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="categoria-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <MenuItem value="">Selecione a opção</MenuItem>
                      <MenuItem value="SIM">SIM</MenuItem>
                      <MenuItem value="NÃO">NÃO</MenuItem>
                    </Select>
                  )}
                />
                {errors?.st?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Resposta é obrigatória!
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 3 }}>
                <InputLabel>Sfco x StTza?</InputLabel>
                <Controller
                  name="sf_st"
                  control={control}
                  rules={{ required: 'Resposta é obrigatória' }}
                  render={({ field }) => (
                    <Select
                      size="small"
                      fullWidth
                      labelId="categoria-label"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <MenuItem value="">Selecione a opção</MenuItem>
                      <MenuItem value="SIM">SIM</MenuItem>
                      <MenuItem value="NÃO">NÃO</MenuItem>
                    </Select>
                  )}
                />
                {errors?.sf_st?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Resposta é obrigatória!
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
