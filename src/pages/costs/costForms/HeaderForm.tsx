import React, { SetStateAction, Dispatch, useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ICost } from '../CostService';
import { IMarkUp } from '../../markUps/MarkUpsService';
import { Api } from '../../../shared/services/api/axios-config';
import { IInfoProductsList } from '../../infoProducts/infoProductsService';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
  onCloseModal: () => void;
  markUp?: IMarkUp;
  handleSubmit(cost: ICost): void;
}

export const HeaderForm: React.FC<Props> = ({
  cost,
  setCost,
  onCloseModal,
  markUp,
  handleSubmit,
}) => {
  const [markUps, setMarkUps] = useState<IMarkUp[]>([]);
  const [informations, setInformations] = useState<IInfoProductsList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarkUpId, setSelectMarkUpId] = useState<string | undefined>(markUp?.id);

  useEffect(() => {
    setLoading(true);
    Api.get('infoProducts')
      .then(res => {
        setInformations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Erro ao carregar informações.');
        setLoading(false);
      });
  }, []);

  const selectedProduct = useMemo((): IInfoProductsList | null => {
    if (!cost.cod) return null;
    const product = informations.find(item => item.cod === cost.cod);
    if (!product) return null;
    return product;
  }, [cost.cod, informations]);

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

  function addHeader(e: any) {
    e.preventDefault();
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
      coef: selectedMarkUp.coef ?? 0,
    };

    if (!selectedProduct) {
      alert('Selecione um produto válido');
      return;
    }

    const updatedCost = {
      ...cost,
      markUpProduct: markUpChosen,
      productInformations: selectedProduct,
    };

    setCost(updatedCost);
    onCloseModal();
  }

  function _handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit({ ...cost });
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cadastro de Custo
      </Typography>
      <form id="header-form" onSubmit={_handleSubmit}>
        <Grid xs={12} container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Código"
              name="cod"
              value={cost.cod}
              onChange={e => setCost({ ...cost, cod: e.target.value.toUpperCase() })}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição do Produto"
              name="name"
              value={cost.name}
              onChange={e => setCost({ ...cost, name: e.target.value.toUpperCase() })}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="unit-label">Unidade</InputLabel>
              <Select
                labelId="unit-label"
                value={cost.unit}
                onChange={e => setCost({ ...cost, unit: e.target.value })}
                label="Unidade"
              >
                <MenuItem value="UN">Unidade</MenuItem>
                <MenuItem value="KG">Quilograma</MenuItem>
                <MenuItem value="CX">Caixa</MenuItem>
                <MenuItem value="PT">Pacote</MenuItem>
                <MenuItem value="LT">Litro</MenuItem>
                <MenuItem value="HR">Hora</MenuItem>
                <MenuItem value="FD">Fardo</MenuItem>
                <MenuItem value="FX">Feixe</MenuItem>
                <MenuItem value="M2">Metro Quadrado</MenuItem>
                <MenuItem value="M3">Metro Cúbico</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantidade"
              name="qt"
              type="number"
              value={cost.qt}
              onChange={e => {
                const value = Number(e.target.value);
                if (value >= 0) setCost({ ...cost, qt: value });
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="produzido-label">Produzido?</InputLabel>
              <Select
                labelId="produzido-label"
                value={cost.type}
                onChange={e => setCost({ ...cost, type: e.target.value })}
                label="Produzido?"
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="st-label">Tem Subst.Trib?</InputLabel>
              <Select
                labelId="st-label"
                value={cost.st}
                onChange={e => setCost({ ...cost, st: e.target.value })}
                label="Tem Subst.Trib?"
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="sf-st-label">Sfco - Stza?</InputLabel>
              <Select
                labelId="sf-st-label"
                value={cost.sf_st}
                onChange={e => setCost({ ...cost, sf_st: e.target.value })}
                label="Sfco -> Stza?"
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="mark-up-label">Mark Up</InputLabel>
              <Select
                labelId="mark-up-label"
                value={selectedMarkUpId ?? ''}
                onChange={e => setSelectMarkUpId(e.target.value || undefined)}
                label="Mark Up"
              >
                <MenuItem value="">Selecione um markUp</MenuItem>
                {markUps.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => addHeader}
            type="submit"
            variant="contained"
            color="primary"
            form="header-form"
          >
            Salvar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCloseModal} sx={{ ml: 1 }}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};
