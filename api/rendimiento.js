import sql from './db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await sql`
        SELECT
          r.id_rendimiento,
          e.nombres || ' ' || e.apellidos AS estudiante,
          e.genero,
          g.nivel AS grado,
          c.nombre AS curso,
          c.area,
          d.nombres AS docente,
          d.especialidad,
          r.nota_promedio,
          r.asistencia
        FROM rendimiento r
        JOIN estudiante e ON r.id_estudiante = e.id_estudiante
        JOIN grado g ON r.id_grado = g.id_grado
        JOIN curso c ON r.id_curso = c.id_curso
        JOIN docente d ON r.id_docente = d.id_docente
        ORDER BY r.id_rendimiento DESC;
      `;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const {
        id_estudiante,
        id_grado,
        id_curso,
        id_docente,
        nota_promedio,
        asistencia,
      } = JSON.parse(body);

      if (!id_estudiante || !id_grado || !id_curso || !id_docente || nota_promedio == null || asistencia == null) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      await sql`
        INSERT INTO rendimiento (
          id_estudiante,
          id_grado,
          id_curso,
          id_docente,
          nota_promedio,
          asistencia
        ) VALUES (
          ${id_estudiante},
          ${id_grado},
          ${id_curso},
          ${id_docente},
          ${nota_promedio},
          ${asistencia}
        )
      `;
      return res.status(201).json({ mensaje: 'Rendimiento registrado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
  }
}
