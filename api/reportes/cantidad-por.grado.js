import sql from '../db.js';

export default async function handler(req, res) {
  try {
    const data = await sql`
      SELECT g.nivel AS grado, COUNT(*) AS cantidad
      FROM rendimiento r
      JOIN grado g ON r.id_grado = g.id_grado
      GROUP BY g.nivel;
    `;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte', detalle: err.message });
  }
}
