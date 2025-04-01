import {
  Box,
  Button,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { AddInjectionOperationsDialog } from './AddInjectionOperationsDialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { CostInjectionOperations, ICost } from '../CostService';

export const InjectionOperationsSheet = () => {
  const navigate = useNavigate();
  const [rowsOperation, setRowsOperation] = useState<CostInjectionOperations[]>([]);
  const [open, setOpen] = useState(false);

  const methods = useForm<ICost>({
    defaultValues: {
      normalOperationsProduct: [],
      totalInjectionOperations: 0,
    },
  });

  const { control, handleSubmit, watch, setValue } = methods;
  const {
    fields: operations,
    append: appendOperation,
    remove: removeOperation,
  } = useFieldArray({
    control,
    name: 'injectionOperationsProduct', // Corrigido o nome do campo
  });

  const injectionOperations = watch('injectionOperationsProduct');

  useEffect(() => {
    // Calcular o total das operações normais
    const totalInjectionOperations =
      injectionOperations?.reduce(
        (sum, item) => sum + (item.totalItemInjectionOperation || 0),
        0,
      ) || 0;

    // Atualizar o valor no formulário
    setValue('totalInjectionOperations', totalInjectionOperations);
  }, [injectionOperations, setValue]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddInjectionOperation = (operation: CostInjectionOperations) => {
    appendOperation(operation); // Adicionar a operação ao array do formulário
  };

  const handleDelete = (id: string) => {};
  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor="#e49330"
          color="white"
          paddingX={2}
          variant="h5"
        >
          Operações de Injeção
        </Typography>
        <Button
          onClick={handleOpen}
          variant="outlined"
          color="primary"
          disableElevation
          startIcon={<Icon>add</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Adicionar Operação
          </Typography>
        </Button>
        <AddInjectionOperationsDialog
          open={open}
          onClose={handleClose}
          onAdd={handleAddInjectionOperation}
        />
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#e49330' }}>
            <TableRow>
              <TableCell align="center">Descrição da operação</TableCell>
              <TableCell align="center">Observação</TableCell>
              <TableCell align="center">Cavidades</TableCell>
              <TableCell align="center">Ciclo</TableCell>
              <TableCell align="center">Valor Hora</TableCell>
              <TableCell align="center">Valor Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.map(operation => (
              <TableRow key={operation.id}>
                <TableCell>{operation.name.toUpperCase()}</TableCell>
                <TableCell>{operation.obs.toUpperCase()}</TableCell>
                <TableCell>{operation.cav}</TableCell>
                <TableCell>{operation.ciclo}</TableCell>
                <TableCell>{formatCurrency(operation.valor, 'BRL')}</TableCell>
                <TableCell>
                  {formatCurrency(operation.totalItemInjectionOperation, 'BRL')}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar o produto"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(operation.id)}
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar o produto"
                      sx={{ color: 'orange' }}
                      onClick={() => navigate(`/products/detalhe/${operation.id}`)}
                    >
                      <FaEdit />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="row" justifyContent="end" marginRight={1}>
        <Typography paddingX={5} bgcolor="#e49330" variant="h6">
          Total de Operações de Injeção
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="#e49330">
          <Typography paddingX={5} variant="h6">
            {formatCurrency(watch('totalInjectionOperations'), 'BRL')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
