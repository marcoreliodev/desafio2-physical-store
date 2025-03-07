import { GeoCoordinates } from '../services/NominatimService';

import { getDatabase } from '../database/connectionDB';

export type IStoresDTO = {
  store_name: string;
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  distance: number;
};

export class StoresRepository {
  async getStoresWithinRadius(
    originPosition: GeoCoordinates,
    maxDistanceInKM: number
  ): Promise<IStoresDTO[]> {
    if (!originPosition || !maxDistanceInKM || maxDistanceInKM <= 0) {
      throw new Error('Parâmetros inválidos');
    }

    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT store_name, street, number, neighborhood, city, state, postal_code, latitude, longitude,
          (6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude))
          )) AS distance
        FROM stores
        WHERE (6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude))
          )) <= ?
        ORDER BY distance;
        `,

        [
          originPosition.lat,
          originPosition.lon,
          originPosition.lat,
          originPosition.lat,
          originPosition.lon,
          originPosition.lat,
          maxDistanceInKM,
        ],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as IStoresDTO[]);
          }
        }
      );
    });
  }
}
