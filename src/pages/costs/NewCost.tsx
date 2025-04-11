import { LayoutBase } from '../../shared/layouts';
import { ToolBarButtons } from '../../shared/components';
import { useNavigate } from 'react-router-dom';
import { CostProvider, useCosts } from '../../shared/contexts';
import { ICost } from './CostService';
import { useEffect, useState } from 'react';
import { InitialCostState } from './InitialCostState';
import { Api } from '../../shared/services/api/axios-config';
import { Box, Paper } from '@mui/material';
import { HeaderSheet } from './costSheets/HeaderSheet';
import { MaterialsSheet } from './costSheets/MaterialsSheet';
import { NormalOperationsSheet } from './costSheets/NormalOperationsSheet';
import { InjectionOperationsSheet } from './costSheets/InjectionOperationsSheet';
import { TotalsInformations } from './costSheets/TotalsInformations';

export const NewCost = () => {
  const navigate = useNavigate();
  const [cost, setCost] = useState<ICost>(InitialCostState);
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

    setCost(state => ({
      ...state,
      totalCost: total,
      unitCost,
    }));
  }, [cost.totalMaterials, cost.totalNormalOperations, cost.injectionOperationsProduct, cost.qt]);

  function removeMaterial(materialId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover este material?');
    if (!userConfirmed) return;
    setCost(prevState => ({
      ...prevState,
      materialsProduct: prevState.materialsProduct.filter(item => item.uuid !== materialId),
    }));
  }

  function removeNormalOperation(normalOperationId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover esta operação?');
    if (!userConfirmed) return;
    setCost(prevState => ({
      ...prevState,
      normalOperationsProduct: prevState.normalOperationsProduct.filter(
        item => item.uuid !== normalOperationId,
      ),
    }));
  }

  function removeInjectionOperation(injectionOperationId: string): void {
    const userConfirmed = window.confirm('Tem certeza que deseja remover esta operação?');
    if (!userConfirmed) return;
    setCost(prevState => ({
      ...prevState,
      injectionOperationsProduct: prevState.injectionOperationsProduct.filter(
        item => item.uuid !== injectionOperationId,
      ),
    }));
  }

  async function addCost(cost: ICost): Promise<void> {
    const data = {
      ...cost,
      materialsProduct: cost.materialsProduct.map(material => ({
        uuid: material.uuid,
        qt: material.qt,
        obs: material.obs,
        totalItemMaterial: material.totalItemMaterial,
      })),
      normalOperationsProduct: cost.normalOperationsProduct.map(operation => ({
        uuid: operation.uuid,
        obs: operation.obs,
        qt: operation.qt,
        totalItemNormalOperation: operation.totalItemNormalOperation,
      })),
      injectionOperationsProduct: cost.injectionOperationsProduct.map(operation => ({
        uuid: operation.uuid,
        obs: operation.obs,
        cav: operation.cav,
        ciclo: operation.ciclo,
        totalItemInjectionOperation: operation.totalItemInjectionOperation,
      })),
      productInformations: {
        mediumPrice: cost.productInformations.mediumPrice,
        priceList: cost.productInformations.priceList,
      },
      markUpProduct: {
        id: cost.markUpProduct.id,
      },
    };

    try {
      const res = await Api.post('products', data);
      setProducts(state => [...state, { ...cost, id: res.data.id }]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erro ao salvar o custo:', (err as any).response?.data || err.message);
      } else {
        console.error('Erro desconhecido ao salvar o custo:', err);
      }
      throw err;
    }
  }

  function handleSubmit(cost: ICost) {
    addCost(cost);
    alert('Produto cadastrado com sucesso');
    navigate('/products');
  }

  return (
    <CostProvider value={{ cost, setCost, products, setProducts }}>
      <LayoutBase
        titulo="Novo Produto"
        toolBar={
          <ToolBarButtons
            textNewButton="Novo"
            showNewButton={false}
            showDeleteButton={true}
            // clickingInSave={}
            clickingInBack={() => {
              navigate('/products');
            }}
          />
        }
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
          <MaterialsSheet cost={cost} setCost={setCost} handleSubmit={handleSubmit} removeMaterial={removeMaterial} />
          <NormalOperationsSheet
            cost={cost}
            setCost={setCost}
            removeOperation={removeNormalOperation}
          />
          <InjectionOperationsSheet
            cost={cost}
            setCost={setCost}
            removeOperation={removeInjectionOperation}
          />
          <TotalsInformations cost={cost} setCost={setCost} />
        </Box>
      </LayoutBase>
    </CostProvider>
  );
};
