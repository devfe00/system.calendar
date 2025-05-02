import { openConnection } from '../config/db.js';
import bcrypt from 'bcryptjs';
import oracledb from 'oracledb';

export const createProvider = async (req, res) => {
  let connection;
  try {
    const { name, email, password, specialty } = req.body;
    
    if (!name || !email || !password || !specialty) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    connection = await openConnection();
    
    console.log("Tentando criar o prestador...");
    
    const checkEmail = await connection.execute(
      `SELECT * FROM USERS WHERE EMAIL = :email`,
      { email }
    );
    
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    
    const userInsert = await connection.execute(
      `INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE) 
       VALUES (:name, :email, :password, 'provider')
       RETURNING ID INTO :id`,
      { 
        name, 
        email, 
        password: hashedPassword,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    const userId = userInsert.outBinds.id[0];
    
    await connection.execute(
      `INSERT INTO PROVIDER_DETAILS (USER_ID, SPECIALTY) 
       VALUES (:userId, :specialty)`,
      { userId, specialty }
    );
    
    await connection.commit();
    
    res.status(201).json({
      message: "Prestador registrado com sucesso",
      id: userId
    });
    
  } catch (error) {
    console.error("Erro ao criar prestador:", error);
    res.status(500).json({ error: "Erro ao criar prestador" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Erro ao fechar conexão:", err);
      }
    }
  }
};

export const getAllProviders = async (req, res) => {
  let connection;
  try {
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT u.ID, u.NAME, u.EMAIL, pd.SPECIALTY 
       FROM USERS u
       JOIN PROVIDER_DETAILS pd ON u.ID = pd.USER_ID
       WHERE u.ROLE = 'provider'`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar prestadores:", error);
    res.status(500).json({ error: "Erro ao buscar prestadores" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Erro ao fechar conexão:", err);
      }
    }
  }
};

export const getProviderById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT u.ID, u.NAME, u.EMAIL, pd.SPECIALTY 
       FROM USERS u
       JOIN PROVIDER_DETAILS pd ON u.ID = pd.USER_ID
       WHERE u.ID = :id AND u.ROLE = 'provider'`,
      { id }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prestador não encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar prestador:", error);
    res.status(500).json({ error: "Erro ao buscar prestador" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Erro ao fechar conexão:", err);
      }
    }
  }
};