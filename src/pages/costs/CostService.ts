import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';
import { IInfoProductsList } from '../infoProducts/infoProductsService';
import { IMarkUp } from '../markUps/MarkUpsService';
import { IMaterial } from '../materials/MaterialsService';
import { IInjectionOperation, INormalOperation } from '../operations/OperationsService';
import { IProductInfo } from '../products/ProductsInfo';

export interface CostMaterial extends IMaterial {
  totalItemMaterial: number;
  obs: string;
  qt: string;
  uuid: string;
}

export interface CostNormalOperations extends INormalOperation {
  totalItemNormalOperation: number;
  obs: string;
  qt: number;
  uuid: string;
}
export interface CostInjectionOperations extends IInjectionOperation {
  totalItemInjectionOperation: number;
  obs: string;
  cav: number;
  ciclo: number;
  uuid: string;
}

export interface ICost {
  cod: string;
  name: string;
  unit: string;
  qt: number;
  st: string;
  type: string;
  sf_st: string;
  id: string;
  totalMaterials: number;
  totalNormalOperations: number;
  totalInjectionOperations: number;
  markUpProduct: IMarkUp;
  totalCost: number;
  unitCost: number;
  materialsProduct: CostMaterial[];
  normalOperationsProduct: CostNormalOperations[];
  injectionOperationsProduct: CostInjectionOperations[];
  productInformations: IInfoProductsList;
  profitProduct: number;
  realProfitProduct: number;
  sugestedPrice: number;
  mediumDiscount: number;
}

export type ICostsList = ICost;
export type ICostDetail = ICost;

type TTotalCountCosts = {
  data: ICostsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountCosts | Error> => {
  try {
    const urlRelativa = `/costs?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: headers['x-total-count']
          ? Number(headers['x-total-count'])
          : Environment.LIMITE_DE_LINHAS,
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: string): Promise<ICostDetail | Error> => {
  try {
    const { data } = await Api.get(`/costs/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<ICostDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<ICostDetail>('/costs', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: ICostDetail): Promise<void | Error> => {
  try {
    await Api.put(`/costs/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/costs/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const CostService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
