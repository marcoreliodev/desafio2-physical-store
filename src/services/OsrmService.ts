import { GeoCoordinates } from './NominatimService';

type OsrmData = {
  routes: {
    distance: number;
    duration: number;
  }[];
};

type RouteResult = {
  distance: string;
  duration: string;
}

export class OsrmService {
  static async calculateRouteDistance(
    startLocation: GeoCoordinates,
    endLocation: GeoCoordinates
  ): Promise<RouteResult> {
    try {
      const response = await fetch(
        `${process.env.OSRM_API_URL}/${startLocation.lon},${startLocation.lat};${endLocation.lon},${endLocation.lat}?overview=false&skip_waypoints=true`
      );

      if (!response.ok) {
        console.error('Erro na requisição: ' + response.statusText);
        throw new Error('Erro na requisição: ' + response.statusText);
      }

      const data: OsrmData = await response.json() as OsrmData;

      const route = data.routes[0];

      const convertedUnits = {
        distance: route.distance / 1000, // kilometers
        duration: route.duration / 60, // minutes
      };

      return {
        distance: `${convertedUnits.distance.toFixed(2)} km`,
        duration: `${convertedUnits.duration.toFixed(0)} min`,
      };
    } catch (error) {
      console.error('Erro ao obter a rota:', error);
      throw new Error('Erro ao obter a rota.')
    }
  }
}
