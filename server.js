import express from 'express';
import dotenv from 'dotenv';
import { openConnection } from './config/db.js'; 
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import providerRoutes from './routes/provider.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

//teste conexao
app.get('/ping', async (req, res) => {
  try {
    const conn = await openConnection();
    const result = await conn.execute('SELECT 1 AS TESTE FROM dual');
    await conn.close();
    res.send(result.rows);
  } catch (err) {
    res.status(500).send({ error: 'Erro de conexão com o banco' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
});

//código finalizado, agora é só esperar os bugs aparecerem
  //Fe – o dev mestre dos bugs
  
  /*
       ,--./,-.        </ >ˆ$
      / #      /
     |       |
      \        \
       `._,._,'
  */
