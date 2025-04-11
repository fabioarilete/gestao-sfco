import { Dispatch, SetStateAction, useEffect } from 'react';
import { ICost } from '../CostService';
import { Box, Grid, Typography } from '@mui/material';
import { MarkUpSheet } from './MarkUpSheet';
import formatCurrency from '../../../shared/utils/formatCurrency';
import { Results } from './costComponents/Results';

interface ITotalsProps {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const TotalsInformations = ({ cost, setCost }: ITotalsProps) => {
  useEffect(() => {
    const totalCost = Math.max(0, Number(cost.totalCost) || 0);
    const coef = Math.max(0, Number(cost.markUpProduct?.coef) || 0);
    const priceList = Math.max(0, Number(cost.productInformations?.priceList) || 0);
    const mediumPrice = Math.max(0, Number(cost.productInformations?.mediumPrice) || 0);
    const qt = Math.max(1, Number(cost.qt) || 1);

    const sugestedPrice = totalCost * coef;
    const mediumDiscount = priceList > 0 ? ((priceList - mediumPrice) / priceList) * 100 : 0;
    const precoDeTabela = priceList * qt;
    const precoMedio = mediumPrice * qt;
    const unitCost = totalCost / qt;

    setCost(state => ({
      ...state,
      sugestedPrice,
      mediumDiscount,
      precoDeTabela,
      precoMedio,
      unitCost,
    }));
  }, [
    cost.totalCost,
    cost.markUpProduct?.coef,
    cost.productInformations?.priceList,
    cost.productInformations?.mediumPrice,
    cost.qt,
    setCost,
  ]);

  useEffect(() => {
    const totalCost = Math.max(0, Number(cost.totalCost) || 0);
    const precoDeTabela = Math.max(0, Number(cost.precoDeTabela) || 0);
    const precoMedio = Math.max(0, Number(cost.precoMedio) || 0);

    const encargos = Math.max(
      0,
      (Number(cost.markUpProduct?.taxes) || 0) +
        (Number(cost.markUpProduct?.admin) || 0) +
        (Number(cost.markUpProduct?.commission) || 0) +
        (Number(cost.markUpProduct?.freight) || 0) +
        (Number(cost.markUpProduct?.financial) || 0) +
        (Number(cost.markUpProduct?.marketing) || 0) +
        (Number(cost.markUpProduct?.promoters) || 0) +
        (Number(cost.markUpProduct?.bonus) || 0),
    );

    const profitPriceList =
      precoDeTabela > 0
        ? ((precoDeTabela - totalCost - (encargos * precoDeTabela) / 100) / precoDeTabela) * 100
        : 0;

    const realProfit =
      precoMedio > 0
        ? ((precoMedio - totalCost - (encargos * precoMedio) / 100) / precoMedio) * 100
        : 0;

    setCost(state => ({
      ...state,
      profitProduct: profitPriceList,
      realProfitProduct: realProfit,
    }));
  }, [cost.markUpProduct, cost.precoDeTabela, cost.totalCost, cost.precoMedio, setCost]);

  const qt = Math.max(1, Number(cost.qt) || 1);
  const unitSugestedPrice = Math.max(0, Number(cost.sugestedPrice) || 0) / qt;
  const unitMediumPrice = Math.max(0, Number(cost.precoMedio) || 0) / qt;
  const unitPriceList = Math.max(0, Number(cost.precoDeTabela) || 0) / qt;

  return (
    <Grid container component="div" display="flex" direction="column" xs={12}>
      <Grid
        container
        component="div"
        display="flex"
        direction="row"
        xs={12}
        justifyContent="flex-end"
        borderBottom={3}
        paddingBottom={2}
      >
        <Box display="flex" flexDirection="column" width="50%" marginRight={3} textAlign="center">
          <Typography bgcolor="#a86a0c" color="white" fontWeight="bold" variant="h6">
            Custo Total
          </Typography>
          <Box display="flex" flexDirection="row" flexGrow={2}>
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Typography bgcolor="#a86a0c" color="white" fontWeight="bold">
                Unitário
              </Typography>
              <Box>
                <Typography border={1} variant="h6">
                  {formatCurrency(Number(cost.unitCost) || 0, 'BRL')}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" flexGrow={1}>
              <Typography bgcolor="#a86a0c" color="white" fontWeight="bold">
                Embalagem
              </Typography>
              <Box>
                <Typography border={1} variant="h6">
                  {formatCurrency(Number(cost.totalCost) || 0, 'BRL')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid container component="div" display="flex" direction="row" xs={12}>
        <Grid container component="div" display="flex" direction="column" xs={3} padding={2}>
          <MarkUpSheet cost={cost} setCost={setCost} />
        </Grid>
        <Grid container component="div" display="flex" direction="column" xs={3} padding={2}>
          <Box border={1} height="100%" display="flex" flexDirection="column">
            <Typography variant="h6" fontWeight="bold" textAlign="center">
              Observações:
            </Typography>
            <Typography color="red" textAlign="center">
              Desconto médio aplicado:
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="red" textAlign="center">
              {(Number(cost.mediumDiscount) || 0).toFixed(2)}%
            </Typography>
          </Box>
        </Grid>
        <Grid
          container
          component="div"
          display="flex"
          direction="column"
          xs={6}
          padding={2}
          gap={4}
        >
          <Results
            title="Preço de Venda - Sugerido"
            colorBox="#4853e7"
            content1={formatCurrency(unitSugestedPrice, 'BRL')}
            content2={formatCurrency(Number(cost.sugestedPrice) || 0, 'BRL')}
            content3={(Number(cost.markUpProduct?.profit) || 0).toFixed(2)}
          />
          <Results
            title="Preço de Tabela - Principal"
            colorBox="#4f3c09"
            content1={formatCurrency(unitPriceList, 'BRL')}
            content2={formatCurrency(Number(cost.precoDeTabela) || 0, 'BRL')}
            content3={(Number(cost.profitProduct) || 0).toFixed(2)}
          />
          <Results
            title="Preço Médio Vendido"
            colorBox="#04570f"
            content1={formatCurrency(unitMediumPrice, 'BRL')}
            content2={formatCurrency(Number(cost.precoMedio) || 0, 'BRL')}
            content3={(Number(cost.realProfitProduct) || 0).toFixed(2)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
