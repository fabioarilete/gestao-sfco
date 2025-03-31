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
import formatCurrency from '../../../shared/utils/formatCurrency';
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { CostMaterial } from '../CostService';
import { useNavigate } from 'react-router-dom';
import { AddMaterialDialog } from './AddMaterialDialog';

export const MaterialsSheet: React.FC = () => {
  const navigate = useNavigate();
  const [rowsMaterial, setRowsMaterial] = useState<CostMaterial[]>([]);
  const [open, setOpen] = useState(false);

  const handleDelete = (id: string) => {};

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMaterial = (material: CostMaterial) => {
    setRowsMaterial(prev => [...prev, material]);
  };

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography fontWeight="bold" bgcolor="green" paddingX={2} variant="h5">
          Materiais
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
            Adicionar Material
          </Typography>
        </Button>
        <AddMaterialDialog open={open} onClose={handleClose} onAdd={handleAddMaterial} />
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'green' }}>
            <TableRow>
              <TableCell align="center">Descrição do Material</TableCell>
              <TableCell align="center">Observação</TableCell>
              <TableCell align="center">Quant.</TableCell>
              <TableCell align="center">Unid.</TableCell>
              <TableCell align="center">Valor Unit.</TableCell>
              <TableCell align="center">Valor Total</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsMaterial.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell>{row.obs.toUpperCase()}</TableCell>
                <TableCell>{row.qt}</TableCell>
                <TableCell>{row.unit.toUpperCase()}</TableCell>
                <TableCell>{formatCurrency(row.price, 'BRL')}</TableCell>
                <TableCell>{formatCurrency(row.totalItemMaterial, 'BRL')}</TableCell>
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
      <Box display="flex" flexDirection="row" justifyContent="end">
        <Typography paddingX={5} bgcolor="green" variant="h6">
          Total de Materiais
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="green">
          <Typography paddingX={5} variant="h6">
            {'R$ 150,00'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
