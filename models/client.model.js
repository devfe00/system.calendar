import { openConnection } from '../config/db.js';

export const createClient = async (client) => {
  const conn = await openConnection();
  const sql = `INSERT INTO clients (name, email) VALUES (:name, :email)`;
  await conn.execute(sql, client, { autoCommit: true });
  await conn.close();
};

export const getAllClients = async () => {
  const conn = await openConnection();
  const result = await conn.execute(`SELECT * FROM clients`);
  await conn.close();
  return result.rows;
};
