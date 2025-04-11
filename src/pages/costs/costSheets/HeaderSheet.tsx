import { Box, Grid, Typography, Paper, Stack, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import logo from '../../../shared/img/logosf.png';
import { Dispatch, SetStateAction, useState } from 'react';
import { ICost } from '../CostService';
import { HeaderForm } from '../costForms/HeaderForm';
import Modal from '../../../shared/components/modal/Modal';
import { IMarkUp } from '../../markUps/MarkUpsService';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
  markUp: IMarkUp;
}

export const HeaderSheet = ({ cost, setCost, markUp }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      {modalOpen && (
        <Modal
          id="header-form"
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          title="Crie seu produto"
          buttonText="Criar"
          maxWidth="sm"
        >
          <HeaderForm
            cost={cost}
            setCost={setCost}
            markUp={markUp}
            onCloseModal={handleCloseModal}
          />
        </Modal>
      )}
      <Grid container spacing={1} alignItems="center">
        {/* Logotipo e Título */}
        <Grid item xs={12} sm={3} md={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={handleOpenModal}
          >
            <img src={logo} alt="Logotipo" style={{ maxWidth: '150px', marginBottom: '4px' }} />
            <Typography variant="h6">Planilha de Custo</Typography>
          </Box>
        </Grid>

        {/* Informações Adicionais */}
        <Grid item xs={12} sm={9} md={10}>
          <Stack
            direction={{ xs: 'column' }}
            spacing={1}
            justifyContent="flex-end"
            alignItems={{ xs: 'flex-end' }}
            sx={{ fontSize: '0.75rem' }}
          >
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Data:
              </Typography>
              <Typography variant="caption">{new Date().toLocaleDateString('pt-BR')}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Tipo de Produto:
              </Typography>
              <Typography variant="caption">
                {cost.type === 'Sim' ? 'Produzido' : 'Revenda'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Subst. Tributária:
              </Typography>
              <Typography variant="caption">{cost.st}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Sfco x STza:
              </Typography>
              <Typography variant="caption">{cost.sf_st}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                MarkUp:
              </Typography>
              <Typography variant="caption">{cost.markUpProduct?.name}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Campos do Produto */}
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1}>
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="caption" fontWeight="bold">
            Código
          </Typography>
          <Paper sx={{ p: 0.75, textAlign: 'center' }} elevation={1}>
            <Typography variant="caption" fontWeight="bold">
              {cost.cod || ''}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="caption" fontWeight="bold">
            Descrição do Produto
          </Typography>
          <Paper sx={{ p: 0.75, textAlign: 'left' }} elevation={1}>
            <Typography variant="caption" fontWeight="bold">
              {cost.name || ''}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="caption" fontWeight="bold">
            Unidade
          </Typography>
          <Paper sx={{ p: 0.75, textAlign: 'center' }} elevation={1}>
            <Typography variant="caption" fontWeight="bold">
              {cost.unit || ''}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="caption" fontWeight="bold">
            Quantidade
          </Typography>
          <Paper sx={{ p: 0.75, textAlign: 'center' }} elevation={1}>
            <Typography variant="caption" fontWeight="bold">
              {cost.qt || ''}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
