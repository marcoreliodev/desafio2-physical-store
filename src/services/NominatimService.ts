import { ViaCepData } from './ViaCepService';

export type GeoCoordinates = {
  lat: number;
  lon: number;
};

type NominatimData = {
  lat: string;
  lon: string;
}[];

export class NominatimService {
  static async getCoordinates(location: ViaCepData): Promise<GeoCoordinates> {
    const { logradouro, localidade, estado } = location;

    try {
      const response = await fetch(
        `${process.env.NOMINATIM_API_URL}?street=${logradouro}&city=${localidade}&state=${estado}&country=Brasil&format=json`
      );

      if (!response.ok) {
        console.error(`Erro na requisição: ${response.status}`);
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: NominatimData = await response.json() as NominatimData;

      if (data.length === 0) {
        console.error('Nenhum dado encontrado para o CEP fornecido.');
        throw new Error('Nenhum dado encontrado para o CEP fornecido.');
      }

      const { lat, lon } = data[0];

      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      throw new Error('Erro ao buscar coordenadas:', error!);
    }
  }
}
