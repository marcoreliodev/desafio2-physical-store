import sqlite3, { Database } from 'sqlite3';

let db: Database | null = null;

export function connectToDatabase(): Promise<Database> {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(`${__dirname}/db.sqlite`, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        reject(err);
        return;
      }

      console.log('Conectado ao banco de dados SQLite');

      database.exec(
        `
        CREATE TABLE IF NOT EXISTS stores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          store_name TEXT NOT NULL,
          street TEXT NOT NULL,
          number INTEGER NOT NULL,
          neighborhood TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          postal_code TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            console.error('Erro ao criar tabelas:', err.message);
            reject(err);
            return;
          }
          console.log('Tabelas verificadas/criadas com sucesso');
          db = database;
          resolve(database);
        }
      );
    });
  });
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error('Falha ao conectar ao banco de dados:', error);
      throw error;
    }
  }
  return db!;
}

export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve();
      return;
    }

    db.close((err) => {
      if (err) {
        console.error('Erro ao fechar o banco de dados:', err.message);
        reject(err);
      } else {
        console.log('Conexão com o banco de dados fechada.');
        db = null;
        resolve();
      }
    });
  });
}
