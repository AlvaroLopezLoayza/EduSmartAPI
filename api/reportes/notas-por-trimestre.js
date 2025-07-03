import sql from '../db.js';

export default async function handler(req, res) {
  try {
    const data = await sql`
      SELECT t.anio, t.trimestre, ROUND(AVG(r.nota_promedio), 2) AS promedio
      FROM rendimiento r
      JOIN tiempo t ON r.id_rendimiento = t.id_tiempo
      GROUP BY t.anio, t.trimestre
      ORDER BY t.anio, t.trimestre;
    `;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte', detalle: err.message });
  }
}
