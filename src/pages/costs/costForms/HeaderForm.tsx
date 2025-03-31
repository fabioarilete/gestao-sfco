import { Box, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import logo from '../../../shared/img/logosf.png';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

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

export const HeaderForm = () => {
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

  return (
    <Box>
      <Grid container direction="column" padding={1} spacing="2px">
        <Grid container direction="row">
          <Grid
            size={3}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img style={{ width: '200px' }} src={logo} />
            <Typography variant="h6">Planilha de Custo</Typography>
          </Grid>
          <Grid
            size={4}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          ></Grid>
          <Grid
            container
            size={5}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid margin={0} size={12} display="flex" justifyContent="end" alignItems="center">
              <Typography>Data: </Typography>
              <span>30/01/2025</span>
            </Grid>
            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Typography>Tipo:</Typography>

              <Controller
                name="type"
                control={control}
                rules={{ required: 'Tipo é obrigatório' }}
                render={({ field }) => (
                  <select
                    style={{ width: 150, height: 25, textAlign: 'center' }}
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    value={field.value}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Produzido">Produzido</option>
                    <option value="Revenda">Revenda</option>
                  </select>
                )}
              />
              {errors?.type?.type === 'required' && (
                <Typography variant="caption" sx={{ color: 'red' }}>
                  Tipo é obrigatório!
                </Typography>
              )}
            </Grid>

            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Typography>Subst. Trib.:</Typography>
              <Controller
                name="st"
                control={control}
                rules={{ required: 'Opção é obrigatória' }}
                render={({ field }) => (
                  <select
                    style={{ width: 150, height: 25, textAlign: 'center' }}
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    value={field.value}
                  >
                    <option value="">Selecione a unidade</option>
                    <option value="SIM">Sim</option>
                    <option value="NÃO">Não</option>
                  </select>
                )}
              />
              {errors?.st?.type === 'required' && (
                <Typography variant="caption" sx={{ color: 'red' }}>
                  Opção é obrigatória!
                </Typography>
              )}
            </Grid>

            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <Typography>
                Sfco x STza:
              </Typography>
              <Controller
                name="sf_st"
                control={control}
                rules={{ required: 'Opção é obrigatória' }}
                render={({ field }) => (
                  <select
                    style={{ width: 150, height: 25, textAlign: 'center' }}
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    value={field.value}
                  >
                    <option value="">Selecione a unidade</option>
                    <option value="SIM">Sim</option>
                    <option value="NÃO">Não</option>
                  </select>
                )}
              />
              {errors?.sf_st?.type === 'required' && (
                <Typography variant="caption" sx={{ color: 'red' }}>
                  Opção é obrigatória!
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid container display="flex" flexDirection="row" padding={1} spacing={1}>
          <Grid size={2}>
            <InputLabel sx={{ textAlign: 'center' }}>Código</InputLabel>
            <TextField
              sx={{ textAlign: 'center' }}
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

          <Grid size={6}>
            <InputLabel sx={{ textAlign: 'center' }}>Descrição do Produto</InputLabel>
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

          <Grid size={2}>
            <InputLabel sx={{ textAlign: 'center' }}>Unidade</InputLabel>
            <Controller
              name="unit"
              control={control}
              rules={{ required: 'Unidade é obrigatória' }}
              render={({ field }) => (
                <Select
                  sx={{ textAlign: 'center' }}
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

          <Grid size={2}>
            <InputLabel>Quantidade:</InputLabel>
            <TextField
              sx={{ textAlign: 'center' }}
              size="small"
              fullWidth
              disabled={isLoading}
              type="number"
              {...register('qt', {
                required: true,
                setValueAs: (value: string) => value,
              })}
            />
            {errors?.qt?.type === 'required' && (
              <Typography variant="caption" sx={{ color: 'red' }}>
                Quantidade é obrigatória!
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
