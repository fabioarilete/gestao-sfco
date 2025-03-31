import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { CostMaterial } from '../CostService'; // Ajuste o caminho conforme necessário

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
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      obs: '',
      qt: 0,
      unit: '',
      price: 0,
    },
    mode: 'onChange', // Validação em tempo real
  });

  const onSubmit = (data: FormData) => {
    const newMaterial: CostMaterial = {
      id: Date.now().toString(), // Gera ID simples
      name: data.name,
      obs: data.obs,
      qt: data.qt,
      unit: data.unit,
      price: data.price,
      totalItemMaterial: data.qt * data.price, // Calcula o total
    };
    onAdd(newMaterial);
    reset(); // Reseta o formulário
    onClose(); // Fecha o Dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Novo Material</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Descrição é obrigatória' }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Descrição do Material"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="obs"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Observação"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <Controller
            name="qt"
            control={control}
            rules={{ required: 'Quantidade é obrigatória', min: { value: 1, message: 'Deve ser maior que 0' } }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Quantidade"
                type="number"
                fullWidth
                variant="outlined"
                error={!!errors.qt}
                helperText={errors.qt?.message}
              />
            )}
          />
          <Controller
            name="unit"
            control={control}
            rules={{ required: 'Unidade é obrigatória' }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Unidade"
                fullWidth
                variant="outlined"
                error={!!errors.unit}
                helperText={errors.unit?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Valor é obrigatório', min: { value: 0, message: 'Deve ser maior ou igual a 0' } }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Valor Unitário"
                type="number"
                fullWidth
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};