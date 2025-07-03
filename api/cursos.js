import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM curso');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { nombre, area } = req.body;
      await conn.execute(
        'INSERT INTO curso (nombre, area) VALUES (?, ?)',
        [nombre, area]
      );
      return res.status(201).json({ mensaje: 'Curso registrado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } finally {
    await conn.end();
  }
}
