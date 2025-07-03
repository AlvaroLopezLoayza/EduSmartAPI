import { getConnection } from './db.js';

export default async function handler(req, res) {
  const conn = await getConnection();

  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute(`
        SELECT 
          g.nivel AS grado, 
          c.nombre AS curso, 
          d.nombres AS docente,
          AVG(r.nota_promedio) AS puntaje_promedio,
          AVG(r.asistencia) AS asistencia_promedio
        FROM rendimiento r
        JOIN grado g ON r.id_grado = g.id_grado
        JOIN curso c ON r.id_curso = c.id_curso
        JOIN docente d ON r.id_docente = d.id_docente
        GROUP BY g.nivel, c.nombre, d.nombres
        ORDER BY g.nivel, c.nombre;
      `);
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { id_estudiante, id_grado, id_curso, id_docente, nota_promedio, asistencia } = req.body;
      if (!id_estudiante || !id_grado || !id_curso || !id_docente || nota_promedio == null || asistencia == null) {
        return res.status(400).json({ error: 'Faltan datos' });
      }
      await conn.execute(`
        INSERT INTO rendimiento 
        (id_estudiante, id_grado, id_curso, id_docente, nota_promedio, asistencia) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id_estudiante, id_grado, id_curso, id_docente, nota_promedio, asistencia]);
      return res.status(201).json({ message: 'Rendimiento registrado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  } finally {
    await conn.end();
  }
}
