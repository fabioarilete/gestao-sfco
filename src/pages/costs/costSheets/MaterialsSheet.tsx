import {
  Box,
  Button,
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
import { Dispatch, SetStateAction, useState } from 'react';
import { CostMaterial, ICost } from '../CostService';
import { MaterialCostForm } from '../costForms/MaterialCostForm';
import Modal from '../../../shared/components/modal/Modal';

interface Props {
  cost: ICost;
  removeMaterial(materialId: string): void;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const MaterialsSheet = ({ cost, removeMaterial, setCost }: Props) => {
  const [materialToEdit, setMaterialToEdit] = useState<CostMaterial | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setMaterialToEdit(undefined);
  };

  const handleSubmit = () => {
    // O fechamento do modal será tratado pelo MaterialCostForm após a submissão
  };

  const totalMaterials = cost.materialsProduct.reduce((sum, m) => sum + m.totalItemMaterial, 0);

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor="#df861a"
          color="white"
          paddingX={2}
          variant="h5"
        >
          Materiais
        </Typography>
        <Box
          sx={{ cursor: 'pointer' }}
          width="35px"
          bgcolor="#0d5717"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={() => {
            setMaterialToEdit(undefined);
            handleOpenModal();
          }}
        >
          <Typography variant="h5" color="white">
            +
          </Typography>
        </Box>

        {modalOpen && (
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit} // Será chamado junto com o submit do formulário
            title={materialToEdit ? 'Editar material' : 'Adicione material ao produto'}
            buttonText={materialToEdit ? 'Salvar' : 'Adicionar'}
            id="material-form"
          >
            <MaterialCostForm
              cost={cost}
              setCost={setCost}
              removeMaterial={removeMaterial}
              material={materialToEdit}
              onCloseModal={handleCloseModal} // Passa a função para fechar o modal
            />
          </Modal>
        )}
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#df861a' }}>
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
            {cost.materialsProduct.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell align="center">{row.obs.toUpperCase()}</TableCell>
                <TableCell align="center">{row.qt}</TableCell>
                <TableCell align="center">{row.unit.toUpperCase()}</TableCell>
                <TableCell align="right">{formatCurrency(row.price, 'BRL')}</TableCell>
                <TableCell align="right">{formatCurrency(row.totalItemMaterial, 'BRL')}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar o material"
                      sx={{ color: 'red' }}
                      onClick={() => removeMaterial(row.id)}
                      aria-label="Apagar material"
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar o material"
                      sx={{ color: 'green' }}
                      onClick={() => {
                        setMaterialToEdit(row);
                        handleOpenModal();
                      }}
                      aria-label="Editar material"
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
        <Typography paddingX={5} bgcolor="#df861a" variant="h6" color="white">
          Total de Materiais
        </Typography>
        <Box display="flex" right={0} border={1} borderColor="#df861a">
          <Typography paddingX={5} variant="h6">
            {formatCurrency(totalMaterials, 'BRL')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
