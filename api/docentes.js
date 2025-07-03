import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM docente');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { nombres, especialidad } = req.body;
      await conn.execute(
        'INSERT INTO docente (nombres, especialidad) VALUES (?, ?)',
        [nombres, especialidad]
      );
      return res.status(201).json({ mensaje: 'Docente registrado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } finally {
    await conn.end();
  }
}
