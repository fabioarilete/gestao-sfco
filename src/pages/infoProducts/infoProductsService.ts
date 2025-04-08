import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';

export interface IInfoProduct {
  id: string;
  cod: string;
  name: string;
  priceList: number;
  mediumPrice: number;
}

export type IInfoProductsList = IInfoProduct;
export type IInfoProductDetail = IInfoProduct;

type TTotalCountInfoProducts = {
  data: IInfoProductsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountInfoProducts | Error> => {
  try {
    const urlRelativa = `/infoProducts?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

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

const getById = async (id: string): Promise<IInfoProductDetail | Error> => {
  try {
    const { data } = await Api.get(`/infoProducts/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IInfoProductDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IInfoProductDetail>('/infoProducts', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IInfoProductDetail): Promise<void | Error> => {
  try {
    await Api.put(`/infoProducts/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/infoProducts/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const InfoProductsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
