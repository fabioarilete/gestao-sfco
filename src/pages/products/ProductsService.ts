import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';

export interface IProduct {
  id: string;
  cod: string;
  name: string;
  unit: string;
  qt: number;
  st: string;
  type: string;
  sf_st: string;
}

export type IProductsList = IProduct;
export type IProductDetail = IProduct;

type TTotalCountProducts = {
  data: IProductsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountProducts | Error> => {
  try {
    const urlRelativa = `/products?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

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

const getById = async (id: string): Promise<IProductDetail | Error> => {
  try {
    const { data } = await Api.get(`/products/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IProductDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IProductDetail>('/products', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IProductDetail): Promise<void | Error> => {
  try {
    await Api.put(`/products/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/products/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const ProductsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
