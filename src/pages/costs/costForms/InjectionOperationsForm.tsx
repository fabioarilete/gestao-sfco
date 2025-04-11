import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, Alert, MenuItem, TextField, CircularProgress } from '@mui/material';
import { CostInjectionOperations, ICost } from '../CostService';
import { Api } from '../../../shared/services/api/axios-config';
import { v4 } from 'uuid';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { IInjectionOperation } from '../../operations/OperationsService';

interface Props {
  operation: CostInjectionOperations | undefined;
  cost: ICost;
  setCost: React.Dispatch<React.SetStateAction<ICost>>;
  onCloseModal: () => void;
  removeOperation(operationId: string): void;
}

export const InjectionOperationsForm = ({ operation, cost, setCost, onCloseModal }: Props) => {
  const [operations, setOperations] = useState<IInjectionOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperationId, setSelectedOperationId] = useState<string | undefined>(operation?.id);
  const [obs, setObs] = useState<string>(operation?.obs || '');
  const [cav, setCav] = useState<number>(operation?.cav ?? 0);
  const [ciclo, setCiclo] = useState<number>(operation?.ciclo ?? 0);

  useEffect(() => {
    setLoading(true);
    Api.get('operations')
      .then(res => {
        setOperations(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Erro ao carregar operações.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedOperation = useMemo(() => {
    if (!selectedOperationId) return null;
    return operations.find(item => item.id === selectedOperationId) || null;
  }, [selectedOperationId, operations]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOperationId || !selectedOperation) {
      alert('Por favor, selecione uma operação válida.');
      return;
    }

    const totalItemInjectionOperation =
      selectedOperation.valor / (((3600 / ciclo) * cav) / cost.qt);

    const newOperation: CostInjectionOperations = {
      ...selectedOperation,
      totalItemInjectionOperation,
      ciclo,
      cav,
      obs,
      uuid: v4(),
      name: selectedOperation.name ?? 'Operação sem nome',
      valor: selectedOperation.valor ?? 0,
    };

    setCost(state => ({
      ...state,
      injectionOperationsProduct: operation
        ? state.injectionOperationsProduct.map(op => (op.id === operation.id ? newOperation : op))
        : [...state.injectionOperationsProduct, newOperation],
    }));

    if (!operation) {
      setObs('');
      setCav(0);
      setCiclo(0);
      setSelectedOperationId(undefined);
    }

    onCloseModal();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <form id="injectionOperation-form" onSubmit={handleSubmit}>
      <Grid container spacing={3} padding={2}>
        <Grid item xs={12}>
          <TextField
            select
            label="Operação de Injeção"
            value={selectedOperationId || ''}
            onChange={e => setSelectedOperationId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Selecione uma operação</MenuItem>
            {operations.map(op => (
              <MenuItem key={op.id} value={op.id}>
                {op.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {selectedOperation && (
          <Grid item xs={12}>
            <Box textAlign="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={500}>
                Valor da Hora:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(selectedOperation.valor, 'BRL')}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            label="Observação"
            value={obs}
            onChange={e => setObs(e.target.value.toUpperCase())}
            placeholder="Faça uma observação"
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            type="number"
            label="Cavidades"
            value={cav}
            onChange={e => setCav(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            type="number"
            label="Ciclo (s)"
            value={ciclo}
            onChange={e => setCiclo(Number(e.target.value))}
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Grid>
      </Grid>
    </form>
  );
};
