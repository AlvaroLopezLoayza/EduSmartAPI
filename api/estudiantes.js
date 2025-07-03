import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();

  try {
    if (req.method === 'POST') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      const data = JSON.parse(body);

      const { nombres, apellidos, genero } = data;

      if (!nombres || !apellidos || !genero) {
        return res.status(400).json({ error: 'Faltan datos' });
      }

      await conn.execute(
        'INSERT INTO estudiante (nombres, apellidos, genero) VALUES (?, ?, ?)',
        [nombres, apellidos, genero]
      );

      return res.status(201).json({ mensaje: 'Estudiante registrado' });
    }

    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM estudiante');
      return res.status(200).json(rows);
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor', detalle: err.message });
  } finally {
    await conn.end();
  }
}
