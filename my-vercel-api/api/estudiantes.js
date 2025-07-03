import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();

  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM estudiante');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { nombres, apellidos, genero } = req.body;
      if (!nombres || !apellidos || !genero) {
        return res.status(400).json({ error: 'Faltan datos' });
      }
      await conn.execute(
        'INSERT INTO estudiante (nombres, apellidos, genero) VALUES (?, ?, ?)',
        [nombres, apellidos, genero]
      );
      return res.status(201).json({ message: 'Estudiante registrado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  } finally {
    await conn.end();
  }
}
