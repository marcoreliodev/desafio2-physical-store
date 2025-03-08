import AppError from '../utils/errors/AppError';

export type ViaCepData = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: string;
};

export class ViaCepService {
  static async getLocationByCep(cep: string): Promise<ViaCepData> {
    const response = await fetch(`${process.env.VIACEP_API_URL}/${cep}/json/`);

    if (!response.ok) {
      throw new Error(
        `Erro ao comunicar com o serviço de CEP: ${response.status} - ${response.statusText}`
      );
    }

    const data: ViaCepData = await response.json() as ViaCepData;

    if (data.erro) {
      throw new AppError('CEP inválido', 400);
    }

    return data;
  }
}
