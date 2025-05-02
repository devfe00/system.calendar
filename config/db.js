import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const db = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

export async function openConnection() {
  try {
    const connection = await oracledb.getConnection(db);
    console.log("conexão com o banco de dados realizada com sucesso!");
    return connection;
  } catch (err) {
    console.error("Erro ao conectar no Oracle:", err);
    throw err;
  }
}