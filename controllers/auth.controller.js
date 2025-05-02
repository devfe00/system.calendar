import { openConnection } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import oracledb from 'oracledb';

export const register = async (req, res) => {
  let connection;
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    connection = await openConnection();
    
    console.log("Tentando criar o cliente...");
    
    const checkEmail = await connection.execute(
      `SELECT * FROM USERS WHERE EMAIL = :email`,
      { email }
    );
    
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }
    
    const result = await connection.execute(
      `INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE) 
       VALUES (:name, :email, :password, 'client')
       RETURNING ID INTO :id`,
      { 
        name, 
        email, 
        password: hashedPassword,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    await connection.commit();
    
    const token = jwt.sign(
      { id: result.outBinds.id[0], role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: "Cliente registrado com sucesso",
      token
    });
    
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro ao criar cliente" });
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

export const login = async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email e senha são obrigatórios" 
      });
    }
    
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT * FROM USERS WHERE EMAIL = :email`,
      { email }
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    
    const user = result.rows[0];
    
    const validPassword = await bcrypt.compare(password, user.PASSWORD);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    
    const token = jwt.sign(
      { id: user.ID, role: user.ROLE },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.ID,
        name: user.NAME,
        email: user.EMAIL,
        role: user.ROLE
      }
    });
    
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no processo de login" });
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