import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase } from '../../shared/layouts';
import { useEffect, useState } from 'react';
import { ToolBarButtons } from '../../shared/components';
import { useForm } from 'react-hook-form';
import { Box, Grid, InputLabel, LinearProgress, Paper, TextField, Typography } from '@mui/material';
import { InfoProductsService } from './infoProductsService';

interface IInfoProductsForm {
  id: string;
  cod: string;
  name: string;
  priceList: number;
  mediumPrice: number;
}

export const InfoProductsForm: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IInfoProductsForm>({
    defaultValues: {
      id: '',
      cod: '',
      name: '',
      priceList: 0, // Corrigido para número
      mediumPrice: 0, // Corrigido para número
    },
  });

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      InfoProductsService.getById(id).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
          navigate('/infoProducts');
        } else {
          setValue('id', res.id);
          setValue('cod', res.cod);
          setValue('name', res.name);
          setValue('priceList', res.priceList);
          setValue('mediumPrice', res.mediumPrice);
          setName(res.name);
        }
      });
    }
  }, [id, navigate, setValue]);

  function handleSave(data: IInfoProductsForm) {
    setIsLoading(true);
    if (id === 'nova') {
      InfoProductsService.create(data).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/infoProducts');
        }
      });
    } else {
      InfoProductsService.updateById(id, { ...data }).then(res => {
        setIsLoading(false);
        if (res instanceof Error) {
          alert(res.message);
        } else {
          navigate('/infoProducts');
        }
      });
    }
  }

  function handleCreateProduct(data: IInfoProductsForm) {
    handleSave(data);
    setName(data.name);
    alert(`${data.name} foi cadastrado com sucesso!`);
  }

  function handleDelete(id: string) {
    if (confirm('Deseja realmente apagar essa informação?')) {
      InfoProductsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          alert('Informação apagada com sucesso!');
          navigate('/infoProducts');
        }
      });
    }
  }

  return (
    <LayoutBase
      titulo={id === 'nova' ? 'Nova Informação de Produto' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Nova"
          showNewButton={id !== 'nova'}
          showDeleteButton={id !== 'nova'}
          clickingInSave={handleSubmit(handleCreateProduct)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => navigate('/infoProducts/detalhe/nova')}
          clickingInBack={() => navigate('/infoProducts')}
        />
      }
    >
      <form onSubmit={handleSubmit(handleCreateProduct)}>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid item>
              <Typography variant="h5">Informações de Produto</Typography>
              <Typography variant="caption">Cadastre informações do produto</Typography>
            </Grid>
            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Código do Produto</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="text"
                  {...register('cod', {
                    required: 'Código é obrigatório',
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                  error={!!errors.cod}
                  helperText={errors.cod?.message}
                />
              </Grid>
            </Grid>

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Nome do Produto</InputLabel>
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
                <InputLabel>Preço de Tabela</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('priceList', {
                    required: 'Preço de Tabela é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.priceList}
                  helperText={errors.priceList?.message}
                />
              </Grid>
            </Grid>

            <Grid item>
              <Grid xs={12} sm={12} md={8} lg={8} xl={6}>
                <InputLabel>Preço Médio</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('mediumPrice', {
                    required: 'Preço Médio é obrigatório',
                    valueAsNumber: true,
                    validate: value => value >= 0 || 'O valor não pode ser menor que 0',
                  })}
                  inputProps={{ min: 0 }}
                  error={!!errors.mediumPrice}
                  helperText={errors.mediumPrice?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </LayoutBase>
  );
};
