import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { CostNormalOperations, ICost } from '../CostService';
import { Api } from '../../../shared/services/api/axios-config';
import { v4 as uuidv4 } from 'uuid';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { INormalOperation } from '../../operations/OperationsService';

interface Props {
  operation?: CostNormalOperations;
  cost: ICost;
  setCost: React.Dispatch<React.SetStateAction<ICost>>;
  onCloseModal: () => void;
  removeOperation: (operationId: string) => void;
}

export const NormalOperationsForm: React.FC<Props> = ({
  operation,
  cost,
  setCost,
  onCloseModal,
  removeOperation,
}) => {
  const [operations, setOperations] = useState<INormalOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperationId, setSelectedOperationId] = useState<string | undefined>(operation?.id);
  const [qt, setQt] = useState<number>(operation?.qt ?? 0);
  const [obs, setObs] = useState<string>(operation?.obs ?? '');

  useEffect(() => {
    const fetchOperations = async () => {
      setLoading(true);
      try {
        const response = await Api.get('operations');
        setOperations(response.data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar operações.');
      } finally {
        setLoading(false);
      }
    };

    fetchOperations();
  }, []);

  const selectedOperation = useMemo(() => {
    return operations.find(op => op.id === selectedOperationId) ?? null;
  }, [selectedOperationId, operations]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOperationId || !selectedOperation) {
      alert('Por favor, selecione uma operação válida.');
      return;
    }

    const totalItemNormalOperation = selectedOperation.valor / (qt || 1);

    const newOperation: CostNormalOperations = {
      ...selectedOperation,
      totalItemNormalOperation,
      qt: qt,
      obs: obs,
      uuid: uuidv4(),
      name: selectedOperation.name ?? 'Operação sem nome',
      valor: selectedOperation.valor ?? 0,
    };

    setCost(prevState => ({
      ...prevState,
      normalOperationsProduct: operation
        ? prevState.normalOperationsProduct.map(op => (op.id === operation.id ? newOperation : op))
        : [...prevState.normalOperationsProduct, newOperation],
    }));

    if (!operation) {
      setObs('');
      setQt(0);
      setSelectedOperationId(undefined);
    }

    onCloseModal();
  };

  if (loading) {
    return (
      <Typography sx={{ textAlign: 'center', py: 3, color: 'grey.600' }}>Carregando...</Typography>
    );
  }

  if (error) {
    return (
      <Typography sx={{ textAlign: 'center', py: 3, color: 'error.main' }}>{error}</Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adicione uma operação normal ao custo
      </Typography>
      <form id="normalOperation-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Operação Normal"
              value={selectedOperationId || ''}
              onChange={e => setSelectedOperationId(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Selecione uma operação</MenuItem>
              {operations.map(op => (
                <MenuItem key={op.id} value={op.id}>
                  {op.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography sx={{ color: 'grey.700', fontSize: 14 }}>Valor da hora:</Typography>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {selectedOperation ? formatCurrency(selectedOperation.valor, 'BRL') : ''}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observação"
              name="obs"
              value={obs}
              onChange={e => setObs(e.currentTarget.value.toUpperCase())}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantidade"
              name="qt"
              type="number"
              value={qt}
              onChange={e => {
                const inputValue = e.target.value;
                const numericValue = Number(inputValue);

                if (inputValue === '' || (!isNaN(numericValue) && numericValue >= 0)) {
                  setQt(inputValue === '' ? 0 : numericValue); // Define 0 se vazio, senão o número
                }
              }}
              inputProps={{ min: 0 }} // Impede setas de irem abaixo de 0
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" form="normalOperation-form">
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
