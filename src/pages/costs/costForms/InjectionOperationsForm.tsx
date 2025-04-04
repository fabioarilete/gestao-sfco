import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CostInjectionOperations, ICost } from '../CostService';
import { Input, SelectOptions } from '../../../shared/components';
import { Api } from '../../../shared/services/api/axios-config';
import { v4 } from 'uuid';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { IInjectionOperation } from '../../operations/OperationsService';

interface Props {
  operation: CostInjectionOperations | undefined; // Adicionando undefined à tipagem
  cost: ICost;
  setCost: React.Dispatch<React.SetStateAction<ICost>>;
  onCloseModal: () => void; // Função para fechar o modal
  removeOperation(operationId: string): void;
}

export const InjectionOperationsForm = ({
  operation,
  cost,
  setCost,
  onCloseModal,
  removeOperation,
}: Props) => {
  const [operations, setOperations] = useState<IInjectionOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOperationId, setSelectOperationId] = useState<string | undefined>(operation?.id);
  const [obs, setObs] = useState<string>(operation?.obs || '');
  const [cav, setCav] = useState<number>(operation?.cav ?? 0);
  const [ciclo, setCiclo] = useState<number>(operation?.ciclo ?? 0);

  useEffect(() => {
    setLoading(true);
    Api.get('operations')
      .then(res => {
        setOperations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Erro ao carregar operações.');
        setLoading(false);
      });
  }, []);

  const selectedOperation = useMemo((): IInjectionOperation | null => {
    if (!selectedOperationId) return null;
    return operations.find(item => item.id === selectedOperationId) || null;
  }, [selectedOperationId, operations]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedOperationId) {
      alert('Por favor, selecione uma operação.');
      return;
    }

    if (!selectedOperation) {
      alert('Operação selecionada não encontrada.');
      return;
    }

    const totalItemInjectionOperation =
      selectedOperation.valor / (((3600 / Number(ciclo)) * Number(cav)) / Number(cost.qt));
    console.log(totalItemInjectionOperation);

    const newOperation: CostInjectionOperations = {
      ...selectedOperation,
      totalItemInjectionOperation,
      ciclo,
      cav,
      obs,
      id: operation?.id || v4(),
      name: selectedOperation.name ?? 'Operação sem nome',
      valor: selectedOperation.valor ?? 0,
    };

    // Log para verificar a operação antes de atualizar
    console.log('Nova operação:', newOperation);

    setCost(state => {
      const updatedState = {
        ...state,
        injectionOperationsProduct: operation
          ? state.injectionOperationsProduct.map(m => (m.id === operation.id ? newOperation : m)) // Edição
          : [...state.injectionOperationsProduct, newOperation], // Adição
      };
      console.log('Updated cost state:', updatedState); // Log do estado após atualização
      return updatedState;
    });

    // Reseta os campos apenas em caso de adição
    if (!operation) {
      setObs(''); // Limpa o campo de observação após a adição
      setCav(0); // Limpa o campo de cav
      setCiclo(0); // Limpa o campo de ciclo
      setSelectOperationId(undefined); // Limpa a operação selecionada
    }

    onCloseModal(); // Fecha o modal após a submissão bem-sucedida
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <form id="injectionOperation-form" onSubmit={handleSubmit}>
      <Grid container spacing={2} display="flex" flexDirection="column">
        <Grid>
          <SelectOptions
            value={selectedOperationId || ''}
            onChange={e => setSelectOperationId(e.target.value || undefined)}
            label="Operação de Injeção"
          >
            <option value="">Selecione uma operação</option>
            {operations.map(item => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </SelectOptions>
        </Grid>
        <Grid>
          <Box display="flex" justifyContent="center">
            <Typography>Valor da hora: </Typography>
            {selectedOperation ? formatCurrency(selectedOperation.valor, 'BRL') : 'N/A'}
          </Box>
        </Grid>
        <Grid>
          <Input
            type="text"
            value={obs}
            label="Observação"
            name="obs"
            placeholder="Faça uma observação"
            onChange={e => setObs(e.currentTarget.value.toUpperCase())}
          />
        </Grid>
        <Grid>
          <Input
            type="number"
            value={cav}
            label="Cavidades"
            name="cav"
            placeholder="Informe a quantidade de cavidades"
            min="0"
            onChange={e => setCav(Number(e.currentTarget.value))}
          />
        </Grid>
        <Grid>
          <Input
            type="number"
            value={ciclo}
            label="Ciclo"
            name="qt"
            placeholder="Informe o ciclo"
            min="0"
            onChange={e => setCiclo(Number(e.currentTarget.value))}
          />
        </Grid>
      </Grid>
    </form>
  );
};
