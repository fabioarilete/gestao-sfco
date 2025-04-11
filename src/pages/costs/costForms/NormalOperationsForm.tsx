import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, TextField, MenuItem } from '@mui/material';
import { CostNormalOperations, ICost } from '../CostService';
import { Input } from '../../../shared/components';
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
  const [quantity, setQuantity] = useState<number>(operation?.qt ?? 0);
  const [observation, setObservation] = useState<string>(operation?.obs ?? '');

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

    const totalItemNormalOperation = selectedOperation.valor / (quantity || 1);

    const newOperation: CostNormalOperations = {
      ...selectedOperation,
      totalItemNormalOperation,
      qt: quantity,
      obs: observation,
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
      setObservation('');
      setQuantity(0);
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
    <form id="normalOperation-form" onSubmit={handleSubmit}>
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: 450,
          mx: 'auto',
          p: 3,
          bgcolor: '#fff',
          borderRadius: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <Grid item xs={12}>
          <TextField
            select
            label="Operação Normal"
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
              {selectedOperation ? formatCurrency(selectedOperation.valor, 'BRL') : 'N/A'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Input
            type="text"
            value={observation}
            label="Observação"
            name="obs"
            placeholder="Faça uma observação"
            onChange={e => setObservation(e.currentTarget.value.toUpperCase())}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '16px',
              minHeight: '60px',
              resize: 'vertical',
              backgroundColor: '#fff',
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            type="number"
            value={quantity}
            label="Quantidade"
            name="qt"
            placeholder="Informe a quantidade"
            inputProps={{ min: 0 }}
            onChange={e => setQuantity(Number(e.currentTarget.value))}
            style={{
              width: '100%',
              padding: '10px',
              border: quantity <= 0 && quantity !== 0 ? '1px solid #d32f2f' : '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: '#fff',
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};
