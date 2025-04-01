import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  SelectChangeEvent,
  Grid as MuiGrid,
  GridProps,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CostOperations } from '../CostService'; // Ajuste o caminho conforme necessário
import { SelectOptions } from '../../../shared/components';

interface AddNormalOperationsDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (operation: CostOperations) => void;
}

interface FormData {
  name: string;
  obs: string;
  qt?: number;
  cav?: number;
  ciclo?: number;
  valor: number;
}

export const AddNormalOperationsDialog: React.FC<AddNormalOperationsDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      obs: '',
      qt: '' as any,
      valor: '' as any,
    },
    mode: 'onChange', // Validação em tempo real
  });

  const [operationCache, setOperationCache] = useState<Map<string, { valor: number }>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const Grid = MuiGrid as React.FC<GridProps>;

  const fetchOperationData = async (operationName: string) => {
    if (operationCache.has(operationName)) {
      const cachedData = operationCache.get(operationName)!;
      setValue('valor', cachedData.valor);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/operations?name=${operationName}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const operation = data[0];
        setValue('valor', operation.valor);
        setOperationCache(prev => new Map(prev).set(operationName, { valor: operation.valor }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    const newOperation: CostOperations = {
      id: Date.now().toString(),
      name: data.name,
      obs: data.obs,
      qt: Number(data.qt),
      valor: data.valor,
      cav: Number(data.cav),
      ciclo: Number(data.ciclo),
      totalItemOperation: data.valor / Number(data.qt),
    };
    onAdd(newOperation);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Adicionar Nova operação</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} display="flex" flexDirection="column">
            <Grid>
              <SelectOptions<FormData>
                control={control}
                name="name"
                label="Operações"
                endpoint="operations"
                rules={{ required: 'Operação é obrigatória' }}
                onChange={(e: SelectChangeEvent<string | number>) => {
                  const operationName = e.target.value as string;
                  if (operationName) {
                    fetchOperationData(operationName);
                  }
                }}
              />
            </Grid>
            <Grid>
              <Controller
                name="obs"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observação"
                    fullWidth
                    variant="outlined"
                    error={!!errors.obs}
                    helperText={errors.obs?.message}
                  />
                )}
              />
            </Grid>
            <Grid>
              <Controller
                name="qt"
                control={control}
                rules={{
                  required: 'Quantidade é obrigatória',
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantidade"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.qt}
                    helperText={errors.qt?.message}
                  />
                )}
              />
            </Grid>

            <Grid>
              <Controller
                name="valor"
                control={control}
                rules={{
                  required: 'Valor é obrigatório',
                  min: { value: 0, message: 'Deve ser maior ou igual a 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    variant="outlined"
                    label="Valor/Hora"
                    InputProps={{
                      readOnly: true,
                      endAdornment: isLoading ? <CircularProgress size={20} /> : null,
                    }}
                    error={!!errors.valor}
                    helperText={errors.valor?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" color="primary" variant="outlined">
              Adicionar
            </Button>
          </DialogActions>
        </Box>
      </form>
    </Dialog>
  );
};
