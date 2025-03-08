import { ViaCepService } from '../services/ViaCepService';
import { NominatimService } from '../services/NominatimService';
import { OsrmService } from '../services/OsrmService';

import AppError from '../utils/errors/AppError';

import { StoresRepository } from './StoresRepository';

export class StoresService {
  constructor(private storesRepository: StoresRepository) {}

  async listNearbyStoresByCep(cep: string) {
    const userLocation = await ViaCepService.getLocationByCep(cep);

    if (!userLocation) {
      throw new Error(
        `Não foi possível encontrar a localização para o CEP: ${cep}`
      );
    }

    const userCoordinates = await NominatimService.getCoordinates(userLocation);

    if (!userCoordinates) {
      throw new Error(
        'Não foi possível recuperar as coordenadas para a localização informada.'
      );
    }

    const radiusInKM = 100;

    const nearbyStores = await this.storesRepository.getStoresWithinRadius(
      userCoordinates,
      radiusInKM
    );

    if (nearbyStores.length === 0) {
      throw new AppError(
        `Nenhuma loja encontrada no raio de ${radiusInKM} Km.`,
        404
      );
    }

    const distancePromises = nearbyStores.map(async (store) => {
      const distance = await OsrmService.calculateRouteDistance(
        userCoordinates,
        {
          lat: store.latitude,
          lon: store.longitude,
        }
      );

      return {
        ...store,
        distance: distance || `${store.distance.toFixed(2)} Km`,
      };
    });

    const stores = await Promise.all(distancePromises);

    return stores;
  }
}
