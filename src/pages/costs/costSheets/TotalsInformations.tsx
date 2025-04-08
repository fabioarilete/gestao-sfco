import { Dispatch, SetStateAction } from 'react';
import { ICost } from '../CostService';
import { Box, Grid, Typography } from '@mui/material';
import { MarkUpSheet } from './MarkUpSheet';
import formatCurrency from '../../../shared/utils/formatCurrency';

interface ITotalsProps {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const TotalsInformations = ({ cost, setCost }: ITotalsProps) => {
  return (
    <Grid container display="flex" direction="row" size={12}>
      <MarkUpSheet cost={cost} setCost={setCost}/>
      <Grid container display="flex" direction="column" size={3}></Grid>
      <Grid container display="flex" direction="column" size={6}>
        <Typography textAlign="center" variant="h5" bgcolor="#033b03" color="white" margin={2}>
          Resultados
        </Typography>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#e91a1a">
            Custo total
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#e91a1a">
            <Typography paddingX={5} variant="h6">
              {formatCurrency(cost.totalCost, 'BRL')}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#5ca4f1">
            Preço Venda Sugerido
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#5ca4f1">
            <Typography paddingX={5} variant="h6">
              {}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#37f337">
            Preço de tabela
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#37f337">
            <Typography paddingX={5} variant="h6">
              {}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#c646e6">
            Desconto médio
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#c646e6">
            <Typography paddingX={5} variant="h6">
              {}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#f14eba">
            Preço médio vendido
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#f14eba">
            <Typography paddingX={5} variant="h6">
              {}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="end"
          marginRight={2}
          marginBottom={1}
        >
          <Typography paddingX={5} variant="h6" color="#e68c0d">
            Margem - preço médio
          </Typography>
          <Box display="flex" right={0} border={1} borderColor="#e68c0d">
            <Typography paddingX={5} variant="h6">
              {}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
