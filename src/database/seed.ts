import { getDatabase } from './connectionDB';

import { logger } from '../utils/logger';

async function runSeed() {
  try {
    const db = await getDatabase();

    const stmt = db.prepare(`
      INSERT INTO stores (store_name, street, number, neighborhood, city, state, postal_code, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const storeData = [
      [
        'Loja 1 PORTO ALEGRE',
        'Rua João Abbott',
        '660',
        'Petrópolis',
        'Porto Alegre',
        'Rio Grande do Sul',
        '90460-150',
        -30.04088,
        -51.18292,
      ],
      [
        'Loja 2 CANOAS',
        'Rua Marechal Rondon',
        '795',
        'Niterói',
        'Canoas',
        'Rio Grande do Sul',
        '92120-210',
        -29.95269,
        -51.168016,
      ],
      [
        'Loja 3 ARROIO DOS RATOS',
        'Largo do Mineiro',
        '135',
        'Centro',
        'Arroio dos Ratos',
        'Rio Grande do Sul',
        '96740-000',
        -30.091809,
        -51.73068,
      ],
      [
        'Loja 4 PELOTAS',
        'Praça Coronel Pedro Osório',
        '61',
        'Centro',
        'Pelotas',
        'Rio Grande do Sul',
        '96015-010',
        -31.769919,
        -52.340948,
      ],
    ];

    for (const store of storeData) {
      stmt.run(...store);
    }

    stmt.finalize();
    logger.info('Dados inseridos com sucesso.');
  } catch (error) {
    logger.error('Erro ao executar o seed:', error);
  }
}

runSeed();
