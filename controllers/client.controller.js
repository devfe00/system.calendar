import { openConnection } from '../config/db.js';

export const getAllClients = async (req, res) => {
  let connection;
  try {
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT ID, NAME, EMAIL FROM USERS WHERE ROLE = 'client'`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: "Erro ao buscar clientes" });
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

export const getClientById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT ID, NAME, EMAIL FROM USERS WHERE ID = :id AND ROLE = 'client'`,
      { id }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ error: "Erro ao buscar cliente" });
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

export const updateClient = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name && !email) {
      return res.status(400).json({ error: "Nenhum dado para atualizar" });
    }
    
    connection = await openConnection();
    
    const checkClient = await connection.execute(
      `SELECT * FROM USERS WHERE ID = :id AND ROLE = 'client'`,
      { id }
    );
    
    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    let updateQuery = `UPDATE USERS SET `;
    const params = { id };
    
    if (name) {
      updateQuery += `NAME = :name`;
      params.name = name;
    }
    
    if (email) {
      if (name) updateQuery += `, `;
      updateQuery += `EMAIL = :email`;
      params.email = email;
    }
    
    updateQuery += ` WHERE ID = :id AND ROLE = 'client'`;
    
    await connection.execute(updateQuery, params);
    await connection.commit();
    
    res.json({ message: "Cliente atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
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

export const deleteClient = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    connection = await openConnection();
    
    const checkClient = await connection.execute(
      `SELECT * FROM USERS WHERE ID = :id AND ROLE = 'client'`,
      { id }
    );
    
    if (checkClient.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    // Excluir o cliente
    await connection.execute(
      `DELETE FROM USERS WHERE ID = :id AND ROLE = 'client'`,
      { id }
    );
    
    await connection.commit();
    
    res.json({ message: "Cliente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ error: "Erro ao excluir cliente" });
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