import { Dispatch, SetStateAction } from 'react';
import { ICost } from '../CostService';
import { Box, Grid, Typography } from '@mui/material';

interface Props {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const MarkUpSheet = ({ cost, setCost }: Props) => {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Typography variant="h6" textAlign="center" bgcolor="#033b03" color="white">
        Mark Up
      </Typography>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Impostos</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.taxes}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Administração</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.admin}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Comissão</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.commission}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Frete</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.freight}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Financeiro</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.financial}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Marketing</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.marketing}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Promotores</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.promoters}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Bonificações</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.bonus}%</Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box width="70%" display="flex" justifyContent="left" paddingLeft={1} borderBottom={1}>
          <Typography variant="subtitle1">Lucro</Typography>
        </Box>
        <Box width="30%" display="flex" justifyContent="right" paddingRight={1} borderBottom={1}>
          <Typography variant="subtitle1">{cost.markUpProduct.profit}%</Typography>
        </Box>
      </Box>
    </Box>
  );
};
