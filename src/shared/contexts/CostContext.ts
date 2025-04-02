import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { ICost } from '../../pages';

interface CostContextValue {
  cost: ICost | null;
  setCost?: Dispatch<SetStateAction<ICost>>;
  products?: ICost[];
  setProducts: Dispatch<SetStateAction<ICost[]>>;
  handleRemove?(id: string): void;
  selectedCost?: ICost | null;
  setSelectedCost?: Dispatch<SetStateAction<ICost | null>>;
}

export const CostContext = createContext<CostContextValue>({} as CostContextValue);
export const CostProvider = CostContext.Provider;
export const CostConsumer = CostContext.Consumer;

export function useCosts(): CostContextValue {
  return useContext(CostContext);
}
