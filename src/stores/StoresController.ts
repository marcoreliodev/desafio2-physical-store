import { Request, Response } from 'express';

import AppError from '../utils/errors/AppError';

import { StoresService } from './StoresService';

export class StoresController {
  constructor(private storesService: StoresService) {}

  findNearbyStores = async (request: Request, response: Response) => {
    const { cep } = request.query;

    const cleanCep = typeof cep === 'string' ? cep.replace(/\D/g, '') : '';

    if (!cep || cleanCep.length !== 8) {
      throw new AppError(
        'O parâmetro cep não pode estar vazio e deve conter exatamente 8 dígitos numéricos.',
        400
      );
    }

    const stores = await this.storesService.listNearbyStoresByCep(cleanCep);

    return void response.status(200).json(stores);
  };
}
