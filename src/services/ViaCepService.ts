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
    try {
      const response = await fetch(
        `${process.env.VIACEP_API_URL}/${cep}/json/`
      );

      if (!response.ok) {
        console.error(`Erro na requisição: ${response.status}`);
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: ViaCepData = await response.json() as ViaCepData;

      if (data.erro) {
        console.error('CEP inválido');
        throw new Error('CEP inválido');
      }

      return data;
    } catch (error) {
      console.error('Erro ao verificar CEP:', error);
      throw new Error('Erro ao verificar CEP:', error!);
    }
  }
}
