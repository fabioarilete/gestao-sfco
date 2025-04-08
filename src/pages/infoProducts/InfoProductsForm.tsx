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
      cod: '',
      name: '',
      priceList: '' as any,
      mediumPrice: '' as any,
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
          setValue('cod', res.cod);
          setValue('name', res.name);
          setValue('priceList', res.priceList);
          setValue('mediumPrice', res.mediumPrice);
          setName(res.name);
        }
      });
    }
  }, [id]);

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

  function handleCreateMaterial(data: IInfoProductsForm) {
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
      titulo={id === 'nova' ? 'Nova Informação de produto' : name}
      toolBar={
        <ToolBarButtons
          textNewButton="Nova"
          showNewButton={id !== 'nova'}
          showDeleteButton={id !== 'nova'}
          clickingInSave={handleSubmit(handleCreateMaterial)}
          clickingInDelete={() => handleDelete(id)}
          clickingInNew={() => {
            navigate('/infoProducts/detalhe/novo');
          }}
          clickingInBack={() => {
            navigate('/infoProducts');
          }}
        />
      }
    >
      <form>
        <Box component={Paper} variant="outlined" margin={1} display="flex" flexDirection="column">
          <Grid>{isLoading && <LinearProgress variant="indeterminate" />}</Grid>
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid>
              <Typography variant="h5">Informações de Produto</Typography>
              <Typography variant="caption">Cadastre informações do produto</Typography>
            </Grid>
            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Código do produto</InputLabel>
                <TextField
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

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Nome do produto</InputLabel>
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

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Preço de Tabela</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('priceList', {
                    required: true,
                    valueAsNumber: true,
                    setValueAs: (value: string) => value,
                  })}
                />
                {errors?.priceList?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Preço de Tabela é obrigatório!
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid direction="row">
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 6 }}>
                <InputLabel>Preço Médio</InputLabel>
                <TextField
                  fullWidth
                  disabled={isLoading}
                  type="number"
                  {...register('mediumPrice', {
                    required: true,
                    valueAsNumber: true,
                    setValueAs: (value: string) => value,
                  })}
                />
                {errors?.mediumPrice?.type === 'required' && (
                  <Typography variant="caption" sx={{ color: 'red' }}>
                    Preço Médio é obrigatório!
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
