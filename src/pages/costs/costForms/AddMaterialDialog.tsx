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
import { CostMaterial } from '../CostService'; // Ajuste o caminho conforme necessário
import { SelectOptions } from '../../../shared/components';

interface AddMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (material: CostMaterial) => void;
}

interface FormData {
  name: string;
  obs: string;
  qt: number;
  unit: string;
  price: number;
}

export const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({ open, onClose, onAdd }) => {
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
      unit: '',
      price: '' as any,
    },
    mode: 'onChange', // Validação em tempo real
  });

  const [materialCache, setMaterialCache] = useState<Map<string, { unit: string; price: number }>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const Grid = MuiGrid as React.FC<GridProps>;

  const fetchMaterialData = async (materialName: string) => {
    if (materialCache.has(materialName)) {
      const cachedData = materialCache.get(materialName)!;
      setValue('unit', cachedData.unit);
      setValue('price', cachedData.price);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/materials?name=${materialName}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const material = data[0];
        setValue('unit', material.unit);
        setValue('price', material.price);
        setMaterialCache(prev =>
          new Map(prev).set(materialName, { unit: material.unit, price: material.price }),
        );
      }
    } catch (error) {
      console.error('Erro ao buscar dados do material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    const newMaterial: CostMaterial = {
      id: Date.now().toString(),
      name: data.name,
      obs: data.obs,
      qt: data.qt,
      unit: data.unit,
      price: data.price,
      totalItemMaterial: data.qt * data.price,
    };
    onAdd(newMaterial);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Adicionar Novo Material</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} display="flex" flexDirection="column">
            <Grid>
              <SelectOptions<FormData>
                control={control}
                name="name"
                label="Materiais"
                endpoint="materials"
                rules={{ required: 'Material é obrigatório' }}
                onChange={(e: SelectChangeEvent<string | number>) => {
                  const materialName = e.target.value as string;
                  if (materialName) {
                    fetchMaterialData(materialName);
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
                name="unit"
                control={control}
                rules={{ required: 'Unidade é obrigatória' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unidade"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: isLoading ? <CircularProgress size={20} /> : null,
                    }}
                    error={!!errors.unit}
                    helperText={errors.unit?.message}
                  />
                )}
              />
            </Grid>
            <Grid>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: 'Valor é obrigatório',
                  min: { value: 0, message: 'Deve ser maior ou igual a 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Unitário"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: isLoading ? <CircularProgress size={20} /> : null,
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
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
