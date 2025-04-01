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
import { useNavigate } from 'react-router-dom';
import { CostOperations, ICost } from '../CostService';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { AddNormalOperationsDialog } from './AddNormalOperationsDialog';
import { useFieldArray, useForm } from 'react-hook-form';

export const NormalOperationsSheet = () => {
  const methods = useForm<ICost>({
    defaultValues: {
      normalOperationsProduct: [],
      totalNormalOperations: 0,
    },
  });

  const navigate = useNavigate();
  const { control, handleSubmit, watch, setValue } = methods;
  const {
    fields: operations,
    append: appendOperation,
    remove: removeOperation,
  } = useFieldArray({
    control,
    name: 'normalOperationsProduct', // Corrigido o nome do campo
  });

  const normalOperations = watch('normalOperationsProduct');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open, setOpen] = React.useState(false);

  const handleAddNormalOperation = (operation: CostOperations) => {
    appendOperation(operation); // Adicionar a operação ao array do formulário
  };

  const handleDelete = (index: number) => {
    removeOperation(index); // Remover a operação do array do formulário
  };

  useEffect(() => {
    // Calcular o total das operações normais
    const totalNormalOperations =
      normalOperations?.reduce((sum, item) => sum + (item.totalItemOperation || 0), 0) || 0;

    // Atualizar o valor no formulário
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
                <Typography color="white">Descrição da operação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Observação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Quant/HR</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Valor Hora</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Valor Total</Typography>
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
                <TableCell>{formatCurrency(row.valor, 'BRL')}</TableCell>
                <TableCell>{formatCurrency(row.totalItemOperation, 'BRL')}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar a operação"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(index)}
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar a operação"
                      sx={{ color: 'green' }}
                      onClick={() => navigate(`/products/detalhe/${row.id}`)}
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
