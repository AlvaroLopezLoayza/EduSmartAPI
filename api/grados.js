import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM grado');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { nivel } = req.body;
      await conn.execute(
        'INSERT INTO grado (nivel) VALUES (?)',
        [nivel]
      );
      return res.status(201).json({ mensaje: 'Grado registrado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } finally {
    await conn.end();
  }
}
