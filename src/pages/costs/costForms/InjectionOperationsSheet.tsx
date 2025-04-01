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
import React, { useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { useFieldArray, useForm } from 'react-hook-form';
import { CostInjectionOperations, ICost } from '../CostService';
import { AddInjectionOperationsDialog } from './AddInjectionOperationsDialog';

export const InjectionOperationsSheet: React.FC = () => {
  const methods = useForm<ICost>({
    defaultValues: {
      injectionOperationsProduct: [],
      totalInjectionOperations: 0,
    },
  });

  const { control, watch, setValue } = methods;
  const {
    fields: operations,
    append: appendOperation,
    remove: removeOperation,
    update: updateOperation,
  } = useFieldArray({
    control,
    name: 'injectionOperationsProduct',
  });

  const injectionOperations = watch('injectionOperationsProduct');
  const [operationToEdit, setOperationToEdit] = React.useState<{
    operation: CostInjectionOperations;
    index: number;
  } | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOperationToEdit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOperationToEdit(null);
  };

  const handleAddInjectionOperation = (operation: CostInjectionOperations) => {
    if (operationToEdit) {
      updateOperation(operationToEdit.index, operation);
    } else {
      appendOperation(operation);
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover esta operação?')) {
      removeOperation(index);
    }
  };

  const handleEdit = (operation: CostInjectionOperations, index: number) => {
    setOperationToEdit({ operation, index });
    setOpen(true);
  };

  useEffect(() => {
    const totalInjectionOperations = injectionOperations.reduce(
      (sum, item) => sum + (item.totalItemInjectionOperation || 0),
      0,
    );
    setValue('totalInjectionOperations', totalInjectionOperations);
  }, [injectionOperations, setValue]);

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor="#ef6318"
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
          operationToEdit={operationToEdit}
          open={open}
          onClose={handleClose}
          onAdd={handleAddInjectionOperation}
        />
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#ef6318' }}>
            <TableRow>
              <TableCell align="center">
                <Typography color="white">Descrição da Operação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Observação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Cav.</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Ciclo</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Valor/Hora</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Custo por Item</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Ações</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell>{row.obs.toUpperCase()}</TableCell>
                <TableCell>{row.cav}</TableCell>
                <TableCell>{row.ciclo}</TableCell>
                <TableCell>{formatCurrency(row.valor, 'BRL')}</TableCell>
                <TableCell>{formatCurrency(row.totalItemInjectionOperation, 'BRL')}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar a operação"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(index)}
                      aria-label="Apagar operação"
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar a operação"
                      sx={{ color: 'green' }}
                      onClick={() => handleEdit(row, index)}
                      aria-label="Editar operação"
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
        <Typography paddingX={5} bgcolor="#ef6318" variant="h6" color="white">
          Total de Operações de Injeção
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="#ef6318">
          <Typography paddingX={5} variant="h6">
            {}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
