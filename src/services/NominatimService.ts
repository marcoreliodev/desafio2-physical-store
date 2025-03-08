import { ViaCepData } from './ViaCepService';

import AppError from '../utils/errors/AppError';

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
    const { localidade, estado } = location;

    const response = await fetch(
      `${process.env.NOMINATIM_API_URL}?city=${localidade}&state=${estado}&country=Brasil&format=json`
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao comunicar com o serviço de geolocalização: ${response.status} - ${response.statusText}`
      );
    }

    const data: NominatimData = await response.json() as NominatimData;

    if (data.length === 0) {
      throw new AppError('Nenhum dado encontrado para o CEP fornecido.', 404);
    }

    const { lat, lon } = data[0];

    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  }
}
