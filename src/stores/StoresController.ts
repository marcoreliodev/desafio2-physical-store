import { Request, Response } from 'express';

import AppError from '../utils/errors/AppError';

import { StoresService } from './StoresService';

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

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

    return void response.status(200).json({
      status: 'success',
      code: HttpStatusCode.OK,
      length: stores.length,
      data: {stores}
    });
  };
}
