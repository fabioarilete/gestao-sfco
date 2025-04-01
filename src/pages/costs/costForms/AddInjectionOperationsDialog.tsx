import React, { useState, useEffect } from 'react';
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
import { SelectOptions } from '../../../shared/components';
import { CostInjectionOperations } from '../CostService';

interface AddInjectionOperationsDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (operation: CostInjectionOperations) => void;
  operationToEdit?: { operation: CostInjectionOperations; index: number } | null; // Nova prop para edição
}

interface FormData {
  name: string;
  obs: string;
  cav?: number;
  ciclo?: number;
  valor: number;
}

export const AddInjectionOperationsDialog: React.FC<AddInjectionOperationsDialogProps> = ({
  open,
  onClose,
  onAdd,
  operationToEdit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    // watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      obs: '',
      cav: 0,
      ciclo: 0,
      valor: 0,
    },
    mode: 'onChange', // Validação em tempo real
  });

  const [operationCache, setOperationCache] = useState<Map<string, { valor: number }>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const Grid = MuiGrid as React.FC<GridProps>;

  // Preencher o formulário com os dados da operação a ser editada
  useEffect(() => {
    if (operationToEdit) {
      const { operation } = operationToEdit;
      setValue('name', operation.name);
      setValue('obs', operation.obs);
      setValue('cav', operation.cav);
      setValue('ciclo', operation.ciclo);
      setValue('valor', operation.valor);
    } else {
      reset({
        name: '',
        obs: '',
        cav: 0,
        ciclo: 0,
        valor: 0,
      });
    }
  }, [operationToEdit, setValue, reset]);

  const fetchOperationData = async (operationName: string) => {
    if (operationCache.has(operationName)) {
      const cachedData = operationCache.get(operationName)!;
      setValue('valor', cachedData.valor);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/operations?name=${operationName}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar operação');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const operation = data[0];
        setValue('valor', operation.valor);
        setOperationCache(prev => new Map(prev).set(operationName, { valor: operation.valor }));
      } else {
        alert('Operação não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados da operação:', error);
      alert('Erro ao buscar dados da operação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular o totalItemNormalOperation em tempo real
  // const valor = watch('valor');
  const totalItemInjectionOperation = 0;

  const onSubmit = (data: FormData) => {
    const newOperation: CostInjectionOperations = {
      id: operationToEdit ? operationToEdit.operation.id : Date.now().toString(),
      name: data.name,
      obs: data.obs,
      cav: data.cav || 0, // Garantir que cav seja 0 se não preenchido
      ciclo: data.ciclo || 0, // Garantir que ciclo seja 0 se não preenchido
      valor: data.valor,
      totalItemInjectionOperation: 0,
    };
    onAdd(newOperation);
    reset();
    onClose();
  };

  const isEditMode = !!operationToEdit;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Editar Operação' : 'Adicionar Nova Operação de injeção'}
      </DialogTitle>
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
                name="cav"
                control={control}
                rules={{
                  required: 'Cavidade é obrigatória',
                  min: { value: 1, message: 'Deve ser maior que 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cavidades"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.cav}
                    helperText={errors.cav?.message}
                  />
                )}
              />
            </Grid>

            <Grid>
              <Controller
                name="ciclo"
                control={control}
                rules={{
                  required: 'Ciclo é obrigatória',
                  min: { value: 1, message: 'Deve ser maior que 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ciclo"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.ciclo}
                    helperText={errors.ciclo?.message}
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
            <Grid>
              <TextField
                label="Custo por Item"
                type="number"
                fullWidth
                value={totalItemInjectionOperation.toFixed(2)}
                InputProps={{ readOnly: true }}
                variant="outlined"
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
              {isEditMode ? 'Salvar Alterações' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Box>
      </form>
    </Dialog>
  );
};
