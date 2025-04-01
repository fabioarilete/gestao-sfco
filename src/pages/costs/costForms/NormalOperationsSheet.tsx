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
import { AddNormalOperationsDialog } from './AddNormalOperationsDialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { CostNormalOperations, ICost } from '../CostService';

export const NormalOperationsSheet: React.FC = () => {
  const methods = useForm<ICost>({
    defaultValues: {
      normalOperationsProduct: [],
      totalNormalOperations: 0,
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
    name: 'normalOperationsProduct',
  });

  const normalOperations = watch('normalOperationsProduct');
  const [operationToEdit, setOperationToEdit] = React.useState<{
    operation: CostNormalOperations;
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

  const handleAddNormalOperation = (operation: CostNormalOperations) => {
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

  const handleEdit = (operation: CostNormalOperations, index: number) => {
    setOperationToEdit({ operation, index });
    setOpen(true);
  };

  useEffect(() => {
    const totalNormalOperations = normalOperations.reduce(
      (sum, item) => sum + (item.totalItemNormalOperation || 0),
      0,
    );
    setValue('totalNormalOperations', totalNormalOperations);
  }, [normalOperations, setValue]);

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor="#5e5ee1"
          color="white"
          paddingX={2}
          variant="h5"
        >
          Operações Normais
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
        <AddNormalOperationsDialog
          operationToEdit={operationToEdit}
          open={open}
          onClose={handleClose}
          onAdd={handleAddNormalOperation}
        />
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#5e5ee1' }}>
            <TableRow>
              <TableCell align="center">
                <Typography color="white">Descrição da Operação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Observação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Quant/HR</Typography>
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
                <TableCell>{row.qt}</TableCell>
                <TableCell>{row.cav}</TableCell>
                <TableCell>{row.ciclo}</TableCell>
                <TableCell>{formatCurrency(row.valor, 'BRL')}</TableCell>
                <TableCell>{formatCurrency(row.totalItemNormalOperation, 'BRL')}</TableCell>
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
        <Typography paddingX={5} bgcolor="#5e5ee1" variant="h6" color="white">
          Total de Operações
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="#5e5ee1">
          <Typography paddingX={5} variant="h6">
            {formatCurrency(watch('totalNormalOperations'), 'BRL')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
