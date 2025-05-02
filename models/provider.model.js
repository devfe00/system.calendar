import { openConnection } from '../config/db.js';

export const createProvider = async (provider) => {
  const conn = await openConnection();
  const sql = `INSERT INTO providers (name, service) VALUES (:name, :service)`;
  await conn.execute(sql, provider, { autoCommit: true });
  await conn.close();
};

export const getAllProviders = async () => {
  const conn = await openConnection();
  const result = await conn.execute(`SELECT * FROM providers`);
  await conn.close();
  return result.rows;
};
