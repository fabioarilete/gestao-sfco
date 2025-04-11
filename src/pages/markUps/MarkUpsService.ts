import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';

export interface IMarkUp {
  id: string;
  name: string;
  taxes: number;
  commission: number;
  admin: number;
  freight: number;
  financial: number;
  promoters: number;
  marketing: number;
  bonus: number;
  profit: number;
  coef: number;
}

export type IMarkUpsList = IMarkUp;
export type IMarkUpDetail = IMarkUp;

type TTotalCountMarkUps = {
  data: IMarkUpsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountMarkUps | Error> => {
  try {
    const urlRelativa = `/markUps?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

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

const getById = async (id: string): Promise<IMarkUpDetail | Error> => {
  try {
    const { data } = await Api.get(`/markUps/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IMarkUpDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IMarkUpDetail>('/markUps', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IMarkUpDetail): Promise<void | Error> => {
  try {
    await Api.put(`/markUps/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/markUps/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const MarkUpsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
