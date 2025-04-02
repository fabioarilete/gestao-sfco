import React, { SetStateAction, Dispatch, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { ICost } from '../CostService';
import { Input, SelectUnit, SelectYesOrNot } from '../../../shared/components';

interface AddHeaderDialogProps {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
  onClose: () => void;
}

export const AddHeaderDialog: React.FC<AddHeaderDialogProps> = ({ onClose, cost, setCost }) => {
  const [open, setOpen] = useState(true);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCost(state => ({
      ...state,
    }));
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
      onTransitionExited={onClose}
    >
      <DialogTitle>Novo Produto</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box>
            <Grid container spacing={2} display="flex" flexDirection="column">
              <Grid size={2}>
                <Input
                  type="text"
                  value={cost.cod}
                  label="Código"
                  name="cod"
                  placeholder="Código"
                  onChange={e =>
                    setCost({
                      ...cost,
                      cod: e.currentTarget.value.toLocaleUpperCase(),
                    })
                  }
                />
              </Grid>

              <Grid size={12}>
                <Input
                  type="text"
                  value={cost.name}
                  label="Descrição do Produto"
                  name="name"
                  placeholder="Descreva o nome do produto..."
                  onChange={e =>
                    setCost({
                      ...cost,
                      name: e.currentTarget.value.toLocaleUpperCase(),
                    })
                  }
                />
              </Grid>
              <Grid container spacing={2} display="flex" flexDirection="row">
                <Grid size={6}>
                  <SelectUnit
                    label="Unidade"
                    name="unit"
                    value={cost.unit}
                    onChange={e =>
                      setCost({
                        ...cost,
                        unit: e.currentTarget.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={6}>
                  <Input
                    type="number"
                    value={cost.qt}
                    label="Quantidade"
                    name="qt"
                    placeholder="Informe a quantidade"
                    onChange={e =>
                      setCost({
                        ...cost,
                        qt: Number(e.currentTarget.value),
                      })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container size={12} display="flex" flexDirection="row">
                <Grid size={4}>
                  <SelectYesOrNot
                    label="Produzido?"
                    name="type"
                    value={cost.type}
                    onChange={e =>
                      setCost({
                        ...cost,
                        type: e.currentTarget.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={4}>
                  <SelectYesOrNot
                    label="Tem Subst.Trib?"
                    name="st"
                    value={cost.st}
                    onChange={e =>
                      setCost({
                        ...cost,
                        st: e.currentTarget.value,
                      })
                    }
                  />
                </Grid>

                <Grid size={4}>
                  <SelectYesOrNot
                    label="Sfco -> Stza?"
                    name="sf_st"
                    value={cost.sf_st}
                    onChange={e =>
                      setCost({
                        ...cost,
                        sf_st: e.currentTarget.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setOpen(false)} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" color="primary" variant="outlined">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
