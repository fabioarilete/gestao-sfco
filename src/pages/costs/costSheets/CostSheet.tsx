import { Box, Paper } from '@mui/material';
import { useState } from 'react';
import { HeaderSheet } from './HeaderSheet';
import { ICost } from '../CostService';
import { initialCostState } from '../InitialCostState';
import { CostProvider, useCosts } from '../../../shared/contexts';
import { AddHeaderDialog } from '../costForms/AddHeaderDialog';

export const CostSheet: React.FC = () => {
  const [cost, setCost] = useState<ICost>(initialCostState);
  const { products, setProducts } = useCosts();
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
        <HeaderSheet
          cost={cost}
          setCost={setCost}
        />

        {/* <TestHeader cost={cost} setCost={setCost} /> */}
        {/* <HeaderForm cost={cost} setCost={setCost} /> */}
        {/* <MaterialsSheet cost={cost} setCost={setCost} /> */}
        {/* <NormalOperationsSheet cost={cost} setCost={setCost} /> */}
        {/* <InjectionOperationsSheet cost={cost} setCost={setCost} /> */}
      </Box>
    </CostProvider>
  );
};
