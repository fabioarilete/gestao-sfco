import { Box, Paper } from '@mui/material';
import { useState } from 'react';
import { HeaderSheet } from './HeaderSheet';
import { ICost } from '../CostService';
import { initialCostState } from '../InitialCostState';
import { CostProvider, useCosts } from '../../../shared/contexts';
import { MaterialsSheet } from './MaterialsSheet';
import { NormalOperationsSheet } from './NormalOperationsSheet';
import { InjectionOperationsSheet } from './InjectionOperationsSheet';

export const CostSheet: React.FC = () => {
  const [cost, setCost] = useState<ICost>(initialCostState);
  const { products, setProducts } = useCosts();

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
        <HeaderSheet cost={cost} setCost={setCost} />
        <MaterialsSheet cost={cost} setCost={setCost} removeMaterial={handleRemove} />
        <NormalOperationsSheet cost={cost} setCost={setCost} removeOperation={handleRemove} />
        <InjectionOperationsSheet cost={cost} setCost={setCost} removeOperation={handleRemove} />
      </Box>
    </CostProvider>
  );
};
