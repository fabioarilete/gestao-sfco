import { ICost } from './CostService';

export const InitialCostState: ICost = {
  cod: '',
  name: '',
  unit: '',
  qt: '' as any,
  st: '',
  type: '',
  sf_st: '',
  id: '',
  materialsProduct: [],
  normalOperationsProduct: [],
  injectionOperationsProduct: [],
  totalMaterials: '' as any,
  totalNormalOperations: '' as any,
  totalInjectionOperations: '' as any,
  markUpProduct: '' as any,
  productInformations: null,
  totalCost: '' as any,
  unitCost: '' as any,
  profit: '' as any,
  realProfit: '' as any,
};
