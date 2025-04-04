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
import { CostNormalOperations, ICost } from '../CostService';
import Modal from '../../../shared/components/modal/Modal';
import { NormalOperationsForm } from '../costForms/NormalOperationsForm';

interface Props {
  cost: ICost;
  removeOperation(operationId: string): void;
  setCost: Dispatch<SetStateAction<ICost>>;
  operation?: CostNormalOperations | undefined; // Adicionando undefined à tipagem
}

export const NormalOperationsSheet = ({ cost, removeOperation, setCost, operation }: Props) => {
  const [operationToEdit, setOperationToEdit] = useState<CostNormalOperations | undefined>(
    undefined,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOperationToEdit(undefined); // Limpa a operação após o fechamento do modal
  };

  const handleSubmit = () => {
    // Lógica para salvar ou atualizar a operação, se necessário
    setModalOpen(false); // Fecha o modal após a operação ser concluída
  };

  const totalNormalOperations = cost.normalOperationsProduct.reduce(
    (sum, m) => sum + m.totalItemNormalOperation,
    0,
  );

  return (
    <Box padding={2} gap={2}>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography
          marginLeft={1}
          fontWeight="bold"
          bgcolor='#8f2e7c'
          color="white"
          paddingX={2}
          variant="h5"
        >
          Operações Normais
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
            setOperationToEdit(undefined); // Limpa a operação ao adicionar uma nova
            handleOpenModal();
          }}
        >
          <Typography variant="h5" color="white">
            +
          </Typography>
        </Box>

        {modalOpen && (
          <Modal
            id="normalOperation-form"
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit} // Será chamado junto com o submit do formulário
            title={operationToEdit ? 'Editar operação' : 'Adicione operação ao produto'}
            buttonText={operationToEdit ? 'Salvar' : 'Adicionar'}
          >
            <NormalOperationsForm
              cost={cost}
              setCost={setCost}
              removeOperation={removeOperation}
              operation={operationToEdit} // Passa a operação a ser editada
              onCloseModal={handleCloseModal} // Passa a função para fechar o modal
            />
          </Modal>
        )}
      </Box>
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#8f2e7c' }}>
            <TableRow>
              <TableCell align="center">
                <Typography color="white">Descrição da operação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Observação</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="white">Quant.</Typography>
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
            {cost.normalOperationsProduct.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell align="center">{row.obs.toUpperCase()}</TableCell>
                <TableCell align="center">{row.qt}</TableCell>
                <TableCell align="right">{formatCurrency(row.valor, 'BRL')}</TableCell>
                <TableCell align="right">
                  {formatCurrency(row.totalItemNormalOperation, 'BRL')}
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar o material"
                      sx={{ color: 'red' }}
                      onClick={() => removeOperation(row.id)}
                      aria-label="Apagar operação"
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar a operação"
                      sx={{ color: 'green' }}
                      onClick={() => {
                        setOperationToEdit(row); // Passa a operação que será editada
                        handleOpenModal();
                      }}
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
        <Typography paddingX={5} bgcolor='#8f2e7c' variant="h6" color="white">
          Total de Operações
        </Typography>
        <Box display="flex" right={0} border={1} borderColor='#8f2e7c'>
          <Typography paddingX={5} variant="h6">
            {formatCurrency(totalNormalOperations, 'BRL')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
