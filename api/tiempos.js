import sql from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const tiempos = await sql`SELECT * FROM tiempo`;
      res.status(200).json(tiempos);
    }

    else if (req.method === 'POST') {
      const { anio, trimestre, mes } = req.body;

      if (!anio || !trimestre || !mes) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      await sql`
        INSERT INTO tiempo (anio, trimestre, mes)
        VALUES (${anio}, ${trimestre}, ${mes})
      `;
      res.status(200).json({ mensaje: 'Tiempo registrado con éxito' });
    }

    else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor', detalle: error.message });
  }
}
