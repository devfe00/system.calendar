import { openConnection } from '../config/db.js';
import oracledb from 'oracledb';
import sendEmail from '../utils/sendEmail.js';


export const createSchedule = async (req, res) => {
  let connection;
  try {
    const { provider_id, client_id, service_date, service_time, service_type } = req.body;
    
    if (!provider_id || !client_id || !service_date || !service_time || !service_type) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios" 
      });
    }
    
    connection = await openConnection();
    
    console.log("Tentando criar o agendamento...");
    
    const providerCheck = await connection.execute(
      `SELECT * FROM USERS WHERE ID = :id AND ROLE = 'provider'`,
      { id: provider_id }
    );
    
    if (providerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Prestador não encontrado" });
    }
    
    const clientCheck = await connection.execute(
      `SELECT * FROM USERS WHERE ID = :id AND ROLE = 'client'`,
      { id: client_id }
    );
    
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    
    const scheduleCheck = await connection.execute(
      `SELECT * FROM SCHEDULES 
       WHERE PROVIDER_ID = :provider_id 
       AND SERVICE_DATE = TO_DATE(:service_date, 'YYYY-MM-DD')
       AND SERVICE_TIME = :service_time`,
      { provider_id, service_date, service_time }
    );
    
    if (scheduleCheck.rows.length > 0) {
      return res.status(400).json({ error: "Horário já está agendado" });
    }
    
    const result = await connection.execute(
      `INSERT INTO SCHEDULES (PROVIDER_ID, CLIENT_ID, SERVICE_DATE, SERVICE_TIME, SERVICE_TYPE, STATUS)
       VALUES (:provider_id, :client_id, TO_DATE(:service_date, 'YYYY-MM-DD'), :service_time, :service_type, 'pending')
       RETURNING ID INTO :id`,
      { 
        provider_id, 
        client_id, 
        service_date,
        service_time,
        service_type,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    await connection.commit();
    
    res.status(201).json({
      message: "Agendamento criado com sucesso",
      id: result.outBinds.id[0]
    });

    sendEmail(
        clientCheck.rows[0].EMAIL, 
        'Confirmação de Agendamento',
        `Seu agendamento está marcado para ${service_date} às ${service_time}`
      );
    
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
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

export const getSchedulesByProvider = async (req, res) => {
  let connection;
  try {
    const { provider_id } = req.params;
    
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT s.ID, s.SERVICE_DATE, s.SERVICE_TIME, s.SERVICE_TYPE, s.STATUS,
              u.NAME as CLIENT_NAME, u.EMAIL as CLIENT_EMAIL
       FROM SCHEDULES s
       JOIN USERS u ON s.CLIENT_ID = u.ID
       WHERE s.PROVIDER_ID = :provider_id
       ORDER BY s.SERVICE_DATE, s.SERVICE_TIME`,
      { provider_id }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
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

export const getSchedulesByClient = async (req, res) => {
  let connection;
  try {
    const { client_id } = req.params;
    
    connection = await openConnection();
    
    const result = await connection.execute(
      `SELECT s.ID, s.SERVICE_DATE, s.SERVICE_TIME, s.SERVICE_TYPE, s.STATUS,
              u.NAME as PROVIDER_NAME, u.EMAIL as PROVIDER_EMAIL,
              pd.SPECIALTY
       FROM SCHEDULES s
       JOIN USERS u ON s.PROVIDER_ID = u.ID
       JOIN PROVIDER_DETAILS pd ON u.ID = pd.USER_ID
       WHERE s.CLIENT_ID = :client_id
       ORDER BY s.SERVICE_DATE, s.SERVICE_TIME`,
      { client_id }
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
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

export const updateScheduleStatus = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: "Status inválido" 
      });
    }
    
    connection = await openConnection();
    
    const scheduleCheck = await connection.execute(
      `SELECT * FROM SCHEDULES WHERE ID = :id`,
      { id }
    );
    
    if (scheduleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    
    await connection.execute(
      `UPDATE SCHEDULES SET STATUS = :status WHERE ID = :id`,
      { status, id }
    );
    
    await connection.commit();
    
    res.json({ message: "Status do agendamento atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
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