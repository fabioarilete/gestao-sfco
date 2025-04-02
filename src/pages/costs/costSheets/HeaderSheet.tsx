import { Box, Grid, Typography } from '@mui/material';
import logo from '../../../shared/img/logosf.png';
import { Dispatch, SetStateAction, useState } from 'react';
import { ICost } from '../CostService';
import ItemInformationCost from './costComponents/ItemInformationCost';
import { AddHeaderDialog } from '../costForms/AddHeaderDialog';

interface IProductForm {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const HeaderSheet = ({ cost, setCost }: IProductForm) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  return (
    <Box padding={2}>
      {isDialogOpen && (
        <AddHeaderDialog cost={cost} setCost={setCost} onClose={() => setIsDialogOpen(false)} />
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
            <img onClick={() => setIsDialogOpen(true)} style={{ width: '200px' }} src={logo} />
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
            <Grid margin={0} size={12} display="flex" justifyContent="end" alignItems="center">
              <Typography>Data: </Typography>
              <span>30/01/2025</span>
            </Grid>
            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <ItemInformationCost title="Tipo de Produto:" content={cost.type} />
              <ItemInformationCost title="Subst. Tributária:" content={cost.st} />
              <ItemInformationCost title="Sfco x STza:" content={cost.sf_st} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container display="flex" flexDirection="row" mt={2}>
          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption">Código:</Typography>
            <Box width="90%" border={1} borderRadius="5px" paddingY={1} textAlign="center" bgcolor= '#f0eca7'>
              {cost.cod}
            </Box>
          </Grid>

          <Grid size={6} display="flex" flexDirection="column">
            <Typography variant="caption">Descrição do Produto:</Typography>
            <Box width="95%" border={1} borderRadius="5px" pl="5px" paddingY={1} textAlign="left">
              {cost.name}
            </Box>
          </Grid>

          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption">Unidade:</Typography>
            <Box width="90%" border={1} borderRadius="5px" paddingY={1} textAlign="center">
              {cost.unit}
            </Box>
          </Grid>

          <Grid size={2} display="flex" flexDirection="column">
            <Typography variant="caption">Quantidade:</Typography>
            <Box width="90%" border={1} borderRadius="5px" paddingY={1} textAlign="center">
              {cost.qt}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
