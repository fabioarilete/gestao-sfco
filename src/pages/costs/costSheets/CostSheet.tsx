import { Box, Paper } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { HeaderSheet } from './HeaderSheet';
import { ICost } from '../CostService';
import { InitialCostState } from '../InitialCostState';
import { CostProvider, useCosts } from '../../../shared/contexts';
import { MaterialsSheet } from './MaterialsSheet';
import { NormalOperationsSheet } from './NormalOperationsSheet';
import { InjectionOperationsSheet } from './InjectionOperationsSheet';
import { TotalsInformations } from './TotalsInformations';

const initialCostState = InitialCostState;

export const CostSheet: React.FC = () => {
  const [cost, setCost] = useState<ICost>(initialCostState);
  const { products, setProducts } = useCosts();

  useEffect(() => {
    let total = 0;
    if (!cost.materialsProduct.length) {
      total = 0;
    }
    total = cost.materialsProduct.reduce((next, item) => {
      const subTotal = item.totalItemMaterial;
      return next + subTotal;
    }, 0);
    setCost((state) => ({
      ...state,
      totalMaterials: total,
    }));
  }, [cost.materialsProduct]);

  useEffect(() => {
    let total = 0;
    if (!cost.normalOperationsProduct.length) {
      total = 0;
    }
    total = cost.normalOperationsProduct.reduce((next, item) => {
      const subTotal = item.totalItemNormalOperation;
      return next + subTotal;
    }, 0);
    setCost((state) => ({
      ...state,
      totalNormalOperations: total,
    }));
  }, [cost.normalOperationsProduct]);

  useEffect(() => {
    let total = 0;
    if (!cost.injectionOperationsProduct.length) {
      total = 0;
    }
    total = cost.injectionOperationsProduct.reduce((next, item) => {
      const subTotal = item.totalItemInjectionOperation;
      return next + subTotal;
    }, 0);
    setCost((state) => ({
      ...state,
      totalInjectionOperations: total,
    }));
  }, [cost.injectionOperationsProduct]);

  useEffect(() => {
    let total = 0;
    if (!cost.totalMaterials && !cost.totalNormalOperations && !cost.totalInjectionOperations) {
      total = 0;
    }
    if (cost.sf_st === 'Sim') {
      total =
        ((Number(cost.totalMaterials) +
          Number(cost.totalNormalOperations) +
          Number(cost.totalInjectionOperations)) *
          114) /
        100;
    } else {
      total =
        Number(cost.totalMaterials) +
        Number(cost.totalNormalOperations) +
        Number(cost.totalInjectionOperations);
    }
    let unitCost = 0;
    if (!total || !cost.qt) {
      unitCost = 0;
    } else {
      unitCost = total / Number(cost.qt);
    }

    setCost((state) => ({
      ...state,
      totalCost: total,
      unitCost,
    }));
  }, [cost.totalMaterials, cost.totalNormalOperations, cost.totalInjectionOperations, cost.qt]);

  function removeMaterial(materialId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover este material?');
    if (!userConfirmed) return;
    setCost((prevState) => ({
      ...prevState,
      materialsProduct: prevState.materialsProduct.filter((item) => item.uuid !== materialId),
    }));
  }

  function removeNormalOperation(normalOperationId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover esta operação?');
    if (!userConfirmed) return;
    setCost((prevState) => ({
      ...prevState,
      normalOperationsProduct: prevState.normalOperationsProduct.filter(
        (item) => item.uuid !== normalOperationId,
      ),
    }));
  }

  function removeInjectionOperation(injectionOperationId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover esta operação?');
    if (!userConfirmed) return;
    setCost((prevState) => ({
      ...prevState,
      injectionOperationsProduct: prevState.injectionOperationsProduct.filter(
        (item) => item.uuid !== injectionOperationId,
      ),
    }));
  }

  return (
    <CostProvider
      value={{
        cost,
        setCost,
        products,
        setProducts,
      }}
    >
      <Box
        component={Paper}
        variant="outlined"
        sx={{
          m: { xs: 2, sm: 4, md: 8 },
          p: 2,
          width: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <HeaderSheet cost={cost} setCost={setCost} markUp={cost.markUpProduct} />
        <Box sx={{ borderTop: 1, borderColor: 'divider', my: 2 }} />
        <MaterialsSheet cost={cost} setCost={setCost} removeMaterial={removeMaterial} />
        <Box sx={{ borderTop: 1, borderColor: 'divider', my: 2 }} />
        <NormalOperationsSheet
          cost={cost}
          setCost={setCost}
          removeOperation={removeNormalOperation}
        />
        <Box sx={{ borderTop: 1, borderColor: 'divider', my: 2 }} />
        <InjectionOperationsSheet
          cost={cost}
          setCost={setCost}
          removeOperation={removeInjectionOperation}
        />
        <Box sx={{ borderTop: 1, borderColor: 'divider', my: 2 }} />
        <TotalsInformations cost={cost} setCost={setCost} />
      </Box>
    </CostProvider>
  );
};
