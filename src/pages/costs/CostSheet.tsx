import { Box, Paper } from '@mui/material';
import { HeaderForm } from './costForms/HeaderForm';
import { MaterialsSheet } from './costForms/MaterialsSheet';
import { NormalOperationsSheet } from './costForms/NormalOperationsSheet';
import { InjectionOperationsSheet } from './costForms/InjectionOperationsSheet';

export const CostSheet: React.FC = () => {

  return (
    <Box component={Paper} variant="outlined" sx={{ mx: 8, width: 'auto' }}>
      <HeaderForm />
      <MaterialsSheet />
      <NormalOperationsSheet />
      <InjectionOperationsSheet />
    </Box>
  );
};
