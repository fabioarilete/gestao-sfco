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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CostMaterial } from '../CostService';
import { SelectOptions } from '../../../shared/components';

interface AddMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (material: CostMaterial) => void;
  materialToEdit?: { material: CostMaterial; index: number } | null;
}

interface FormData {
  name: string;
  obs?: string; // Ajustado para ser opcional
  qt: number;
  unit: string;
  price: number;
}

export const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({
  open,
  onClose,
  onAdd,
  materialToEdit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      obs: '',
      qt: 0,
      unit: '',
      price: 0,
    },
    mode: 'onChange',
  });

  const [materialCache, setMaterialCache] = useState<Map<string, { price: number; unit: string }>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const Grid = MuiGrid as React.FC<GridProps>;

  // Preencher o formulário com os dados do material a ser editado
  useEffect(() => {
    if (materialToEdit) {
      const { material } = materialToEdit;
      setValue('name', material.name);
      setValue('obs', material.obs);
      setValue('qt', material.qt);
      setValue('unit', material.unit);
      setValue('price', material.price);
    } else {
      reset({
        name: '',
        obs: '',
        qt: 0,
        unit: '',
        price: 0,
      });
    }
  }, [materialToEdit, setValue, reset]);

  const fetchMaterialData = async (materialName: string) => {
    if (materialCache.has(materialName)) {
      const cachedData = materialCache.get(materialName)!;
      setValue('price', cachedData.price);
      setValue('unit', cachedData.unit);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/materials?name=${materialName}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar material');
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const material = data[0];
        setValue('price', material.price);
        setValue('unit', material.unit);
        setMaterialCache(prev =>
          new Map(prev).set(materialName, { price: material.price, unit: material.unit }),
        );
      } else {
        alert('Material não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do material:', error);
      alert('Erro ao buscar dados do material. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const qt = watch('qt');
  const price = watch('price');
  const totalItemMaterial = qt * price;

  const onSubmit = (data: FormData) => {
    const newMaterial: CostMaterial = {
      id: materialToEdit ? materialToEdit.material.id : Date.now().toString(),
      name: data.name,
      obs: data.obs || '', // Garantir que obs seja uma string vazia se undefined
      qt: data.qt,
      unit: data.unit,
      price: data.price,
      totalItemMaterial: data.price * data.qt,
    };
    onAdd(newMaterial);
    reset();
    onClose();
  };

  const isEditMode = !!materialToEdit;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Editar Material' : 'Adicionar Novo Material'}</DialogTitle>
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
                    value={field.value ?? ''} // Garantir que o valor seja uma string
                    onChange={e => field.onChange(e.target.value || undefined)} // Permitir undefined
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
                  min: { value: 1, message: 'Deve ser maior que 0' },
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
                    InputProps={{ readOnly: true }}
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
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Deve ser maior ou igual a 0' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preço Unitário"
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
            <Grid>
              <TextField
                label="Total do Material"
                type="number"
                fullWidth
                value={totalItemMaterial.toFixed(2)}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="outlined">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
