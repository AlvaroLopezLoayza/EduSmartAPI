import sql from '../db.js';

export default async function handler(req, res) {
  try {
    const data = await sql`
      SELECT d.nombres AS docente, ROUND(AVG(r.asistencia), 1) AS asistencia
      FROM rendimiento r
      JOIN docente d ON r.id_docente = d.id_docente
      GROUP BY d.nombres
      ORDER BY asistencia DESC;
    `;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte', detalle: err.message });
  }
}
