import { Environment } from '../../shared/environments';
import { Api } from '../../shared/services/api/axios-config';

export interface IMaterial {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export type IMaterialsList = IMaterial;
export type IMaterialDetail = IMaterial;

type TTotalCountMaterials = {
  data: IMaterialsList[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TTotalCountMaterials | Error> => {
  try {
    const urlRelativa = `/materials?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&name_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      // Verificação adicional para o cabeçalho x-total-count
      // if (headers['x-total-count']) {
      //   console.log('Total Count do cabeçalho:', headers['x-total-count']);
      // } else {
      //   console.error('Cabeçalho x-total-count não encontrado.');
      // }

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

const getById = async (id: string): Promise<IMaterialDetail | Error> => {
  try {
    const { data } = await Api.get(`/materials/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IMaterialDetail, 'id'>): Promise<string | Error> => {
  try {
    const { data } = await Api.post<IMaterialDetail>('/materials', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string, dados: IMaterialDetail): Promise<void | Error> => {
  try {
    await Api.put(`/materials/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/materials/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const MaterialsService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
