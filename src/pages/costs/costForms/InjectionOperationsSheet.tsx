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
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { CostOperations } from '../CostService';
import formatCurrency from '../../../shared/utils/formatCurrency';

export const InjectionOperationsSheet = () => {
  const navigate = useNavigate();
  const [rowsOperation, setRowsOperation] = useState<CostOperations[]>([]);

  const handleDelete = (id: string) => {};
  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography fontWeight="bold" bgcolor="orange" paddingX={2} variant="h5">
          Operações de Injeção
        </Typography>
        <Button variant="outlined" color="primary" disableElevation startIcon={<Icon>add</Icon>}>
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Adicionar Operação
          </Typography>
        </Button>
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'orange' }}>
            <TableRow>
              <TableCell align="center">Descrição da operação</TableCell>
              <TableCell align="center">Observação</TableCell>
              <TableCell align="center">Cavidades</TableCell>
              <TableCell align="center">Ciclo</TableCell>
              <TableCell align="center">Valor Unit.</TableCell>
              <TableCell align="center">Valor Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsOperation.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell>{row.obs.toUpperCase()}</TableCell>
                <TableCell>{row.qt}</TableCell>
                <TableCell>{row.unit.toUpperCase()}</TableCell>
                <TableCell>{formatCurrency(row.valor, 'BRL')}</TableCell>
                <TableCell>{formatCurrency(row.totalItemOperation, 'BRL')}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar o produto"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(row.id)}
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar o produto"
                      sx={{ color: 'orange' }}
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
      <Box display="flex" flexDirection="row" justifyContent="end">
        <Typography paddingX={5} bgcolor="orange" variant="h6">
          Total de Operações de Injeção
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="orange">
          <Typography paddingX={5} variant="h6">
            {'R$ 150,00'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
