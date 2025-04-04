import { Box, Grid, Typography } from '@mui/material';
import logo from '../../../shared/img/logosf.png';
import { Dispatch, SetStateAction, useState } from 'react';
import { ICost } from '../CostService';
import ItemInformationCost from './costComponents/ItemInformationCost';
import { HeaderForm } from '../costForms/HeaderForm';
import Modal from '../../../shared/components/modal/Modal';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const HeaderSheet = ({ cost, setCost }: Props) => {
  const [modalOpen, setModalOpen] = useState(true);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  function handleSubmit() {
    setModalOpen(false);
  }

  return (
    <Box padding={2}>
      {modalOpen && (
        <Modal
          id="header-form"
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          title="Crie seu produto"
          buttonText="Criar"
        >
          <HeaderForm
            cost={cost}
            setCost={setCost}
            onCloseModal={handleCloseModal} // Passa a função para fechar o modal
          />
        </Modal>
      )}
      <Grid container direction="column" padding={1} spacing="2px">
        <Grid container direction="row">
          <Grid
            size={3}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img onClick={() => setModalOpen(true)} style={{ width: '200px' }} src={logo} />
            <Typography variant="h6">Planilha de Custo</Typography>
          </Grid>

          <Grid
            size={5}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          ></Grid>

          <Grid
            container
            size={4}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <ItemInformationCost title="Data:" content={`02/04/2025`} />
              <ItemInformationCost
                title="Tipo de Produto:"
                content={cost.type === 'SIM' ? 'Produzido' : 'Revenda'}
              />
              <ItemInformationCost title="Subst. Tributária:" content={cost.st} />
              <ItemInformationCost title="Sfco x STza:" content={cost.sf_st} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container display="flex" flexDirection="row" mt={2}>
          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption" fontWeight="bold">
              Código:
            </Typography>
            <Box
              width="90%"
              borderRadius="5px"
              paddingY={1}
              textAlign="center"
              bgcolor="#f0eca7"
              color="blue"
              fontWeight="bold"
            >
              {cost.cod}
            </Box>
          </Grid>

          <Grid size={6} display="flex" flexDirection="column">
            <Typography variant="caption" fontWeight="bold">
              Descrição do Produto:
            </Typography>
            <Box
              width="95%"
              borderRadius="5px"
              pl="5px"
              paddingY={1}
              textAlign="left"
              bgcolor="#f0eca7"
              color="blue"
              fontWeight="bold"
            >
              {cost.name}
            </Box>
          </Grid>

          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption" fontWeight="bold">
              Unidade:
            </Typography>
            <Box
              width="90%"
              borderRadius="5px"
              paddingY={1}
              textAlign="center"
              bgcolor="#f0eca7"
              color="blue"
              fontWeight="bold"
            >
              {cost.unit}
            </Box>
          </Grid>

          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption" fontWeight="bold">
              Quantidade:
            </Typography>
            <Box
              width="90%"
              borderRadius="5px"
              paddingY={1}
              textAlign="center"
              bgcolor="#f0eca7"
              color="blue"
              fontWeight="bold"
            >
              {cost.qt}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
