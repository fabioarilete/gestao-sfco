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
import React, { useEffect } from 'react';
import { CostMaterial, ICost } from '../CostService';
import { useNavigate } from 'react-router-dom';
import { AddMaterialDialog } from './AddMaterialDialog';
import { useFieldArray, useForm } from 'react-hook-form';

export const MaterialsSheet: React.FC = () => {
  const methods = useForm<ICost>({
    defaultValues: {
      materialsProduct: [],
      totalMaterials: 0,
    },
  });

  const navigate = useNavigate();
  const { control, watch, setValue } = methods;
  const {
    fields: materials,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: 'materialsProduct',
  });

  const materialsProduct = watch('materialsProduct');

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMaterial = (material: CostMaterial) => {
    appendMaterial(material);
  };

  const handleDelete = (index: number) => {
    removeMaterial(index);
  };

  useEffect(() => {
    // Calcular o total dos materiais
    const totalMaterials =
      materialsProduct?.reduce((sum, item) => sum + (item.totalItemMaterial || 0), 0) || 0;

    // Atualizar o valor no formulário
    setValue('totalMaterials', totalMaterials);
  }, [materialsProduct, setValue]);

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor="#1ca22e"
          color="white"
          paddingX={2}
          variant="h5"
        >
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
          <TableHead sx={{ backgroundColor: '#1ca22e' }}>
            <TableRow>
              <TableCell align="center">
                <Typography color="white">Descrição do Material</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Observação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Quant.</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Unid.</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Valor Unit.</Typography>
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
            {materials.map((row, index) => (
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
                      title="Apagar o material"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(index)}
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar o material"
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
        <Typography paddingX={5} bgcolor="#1ca22e" variant="h6" color="white">
          Total de Materiais
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="#1ca22e">
          <Typography paddingX={5} variant="h6">
            {formatCurrency(watch('totalMaterials'), 'BRL')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
