import React, { SetStateAction, Dispatch, useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ICost } from '../CostService';
import { Input, SelectOptions, SelectUnit, SelectYesOrNot } from '../../../shared/components';
import { IMarkUp } from '../../markUps/MarkUpsService';
import { Api } from '../../../shared/services/api/axios-config';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
  onCloseModal: () => void;
  markUp?: IMarkUp;
}

export const HeaderForm: React.FC<Props> = ({ cost, setCost, onCloseModal, markUp }) => {
  const [markUps, setMarkUps] = useState<IMarkUp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarkUpId, setSelectMarkUpId] = useState<string | undefined>(markUp?.id);

  useEffect(() => {
    setLoading(true);
    Api.get('markUps')
      .then(res => {
        setMarkUps(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Erro ao carregar markUps.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (markUp?.id) {
      setSelectMarkUpId(markUp.id);
    }
  }, [markUp]);

  const selectedMarkUp = useMemo((): IMarkUp | null => {
    if (!selectedMarkUpId) return null;
    return markUps.find(item => item.id === selectedMarkUpId) || null;
  }, [selectedMarkUpId, markUps]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedMarkUp) {
      alert('Por favor, selecione um MarkUp válido.');
      return;
    }

    const markUpChosen: IMarkUp = {
      id: selectedMarkUp.id,
      name: selectedMarkUp.name,
      taxes: selectedMarkUp.taxes ?? 0,
      admin: selectedMarkUp.admin ?? 0,
      freight: selectedMarkUp.freight ?? 0,
      commission: selectedMarkUp.commission ?? 0,
      financial: selectedMarkUp.financial ?? 0,
      marketing: selectedMarkUp.marketing ?? 0,
      promoters: selectedMarkUp.promoters ?? 0,
      bonus: selectedMarkUp.bonus ?? 0,
      profit: selectedMarkUp.profit ?? 0,
    };

    setCost({
      ...cost, // Usando a prop cost diretamente
      markUpProduct: markUpChosen,
    });

    onCloseModal();
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>{error}</Typography>;

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
                  cod: e.currentTarget.value.toUpperCase(),
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
                  name: e.currentTarget.value.toUpperCase(),
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
                onChange={e => {
                  const value = Number(e.currentTarget.value);
                  if (value >= 0) {
                    setCost({ ...cost, qt: value });
                  }
                }}
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

            <Grid size={4}>
              <SelectOptions
                value={selectedMarkUpId ?? ''}
                onChange={e => setSelectMarkUpId(e.target.value || undefined)}
                label="Mark Up"
              >
                <option value="">Selecione um MarkUp</option>
                {markUps.map(item => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectOptions>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};
