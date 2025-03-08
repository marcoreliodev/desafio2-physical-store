import { GeoCoordinates } from './NominatimService';

import { logger } from '../utils/logger';

type OsrmData = {
  routes: {
    distance: number;
    duration: number;
  }[];
};

type RouteResult = {
  distance: string;
  duration: string;
};

export class OsrmService {
  static async calculateRouteDistance(
    startLocation: GeoCoordinates,
    endLocation: GeoCoordinates
  ): Promise<RouteResult | null> {
    const response = await fetch(
      `${process.env.OSRM_API_URL}/${startLocation.lon},${startLocation.lat};${endLocation.lon},${endLocation.lat}?overview=false&skip_waypoints=true`
    );

    if (!response.ok) {
      logger.error(
        `Erro ao comunicar com o serviço de calcular rota: ${response.status} - ${response.statusText}`
      );
      return null;
    }

    const data: OsrmData = await response.json() as OsrmData;

    if (!data.routes || data.routes.length === 0) {
      logger.error('Nenhuma rota encontrada para as coordenadas fornecidas');
      return null;
    }

    const route = data.routes[0];

    const convertedUnits = {
      distance: route.distance / 1000, // kilometers
      duration: route.duration / 60, // minutes
    };

    return {
      distance: `${convertedUnits.distance.toFixed(2)} km`,
      duration: `${convertedUnits.duration.toFixed(0)} min`,
    };
  }
}
