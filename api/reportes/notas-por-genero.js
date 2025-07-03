import sql from '../db.js';

export default async function handler(req, res) {
  try {
    const data = await sql`
      SELECT e.genero, ROUND(AVG(r.nota_promedio), 2) AS promedio
      FROM rendimiento r
      JOIN estudiante e ON r.id_estudiante = e.id_estudiante
      GROUP BY e.genero;
    `;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte', detalle: err.message });
  }
}
