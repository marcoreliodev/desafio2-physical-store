import { StoresRepository } from '../stores/StoresRepository';
import { StoresService } from '../stores/StoresService';
import { StoresController } from '../stores/StoresController';

const storesRepository = new StoresRepository();
const storesService = new StoresService(storesRepository);
const storesController = new StoresController(storesService);

import { Router } from 'express';

const storesRouter = Router();

storesRouter.get('/stores/nearby', storesController.findNearbyStores);

export { storesRouter };
