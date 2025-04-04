import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';

export interface INormalOperation {
  id: string;
  name: string;
  valor: number;
  qt: number;
}

export interface AllOperations {
  id: string;
  name: string;
  valor: number;
  unit: string;
  type: string;
}

export interface IInjectionOperation {
  id: string;
  name: string;
  valor: number;
  ciclo: number;
  cav: number;
}

export type IOperationsList = AllOperations;
export type IOperationDetail = AllOperations;

type TTotalCountOperations = {
  data: IOperationsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountOperations | Error> => {
  try {
    const urlRelativa = `/operations?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

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

const getById = async (id: string): Promise<IOperationDetail | Error> => {
  try {
    const { data } = await Api.get(`/operations/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IOperationDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IOperationDetail>('/operations', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IOperationDetail): Promise<void | Error> => {
  try {
    await Api.put(`/operations/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/operations/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const OperationsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
