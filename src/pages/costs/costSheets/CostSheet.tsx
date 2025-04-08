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

interface ITotalsProps {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

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

    setCost(state => ({
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

    setCost(state => ({
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

    setCost(state => ({
      ...state,
      totalInjectionOperations: total,
    }));
  }, [cost.injectionOperationsProduct]);

  useEffect(() => {
    let total = 0;

    if (!cost.totalMaterials && !cost.totalNormalOperations && !cost.totalInjectionOperations) {
      total = 0;
    }

    if (cost.sf_st === 'SIM') {
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
    if (!total) {
      unitCost = 0;
    }
    unitCost = total / Number(cost.qt);

    setCost(state => ({
      ...state,
      totalCost: total,
      unitCost,
    }));
  }, [cost.totalMaterials, cost.totalNormalOperations, cost.totalInjectionOperations]);

  function handleRemove() {}

  return (
    <CostProvider
      value={{
        cost,
        setCost,
        products,
        setProducts,
      }}
    >
      <Box component={Paper} variant="outlined" sx={{ mx: 8, width: 'auto' }}>
        <HeaderSheet cost={cost} setCost={setCost} markUp={cost.markUpProduct} />
        <MaterialsSheet cost={cost} setCost={setCost} removeMaterial={handleRemove} />
        <NormalOperationsSheet cost={cost} setCost={setCost} removeOperation={handleRemove} />
        <InjectionOperationsSheet cost={cost} setCost={setCost} removeOperation={handleRemove} />
        <TotalsInformations cost={cost} setCost={setCost} />
      </Box>
    </CostProvider>
  );
};
