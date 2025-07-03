import sql from '../db.js';

export default async function handler(req, res) {
  try {
    const data = await sql`
      SELECT c.nombre AS curso, ROUND(AVG(r.nota_promedio), 2) AS promedio
      FROM rendimiento r
      JOIN curso c ON r.id_curso = c.id_curso
      GROUP BY c.nombre
      ORDER BY promedio DESC;
    `;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte', detalle: err.message });
  }
}
