import React, { SetStateAction, Dispatch } from 'react';
import { Box, Grid } from '@mui/material';
import { ICost } from '../CostService';
import { Input, SelectUnit, SelectYesOrNot } from '../../../shared/components';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
  onCloseModal: () => void; // Função para fechar o modal
}

export const HeaderForm: React.FC<Props> = ({ cost, setCost, onCloseModal }) => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCost(state => ({
      ...state,
    }));
    onCloseModal();
  }

  return (
    <form id="header-form" onSubmit={handleSubmit}>
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
    </form>
  );
};
