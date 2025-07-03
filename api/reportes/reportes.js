import sql from '././db.js';

const queries = {
  'notas-por-curso': `
    SELECT c.nombre AS curso, ROUND(AVG(r.nota_promedio), 2) AS promedio
    FROM rendimiento r
    JOIN curso c ON r.id_curso = c.id_curso
    GROUP BY c.nombre
    ORDER BY promedio DESC
  `,
  'asistencia-por-docente': `
    SELECT d.nombres AS docente, ROUND(AVG(r.asistencia), 1) AS asistencia
    FROM rendimiento r
    JOIN docente d ON r.id_docente = d.id_docente
    GROUP BY d.nombres
    ORDER BY asistencia DESC
  `,
  'notas-por-genero': `
    SELECT e.genero, ROUND(AVG(r.nota_promedio), 2) AS promedio
    FROM rendimiento r
    JOIN estudiante e ON r.id_estudiante = e.id_estudiante
    GROUP BY e.genero
  `,
  'notas-por-trimestre': `
    SELECT t.anio, t.trimestre, ROUND(AVG(r.nota_promedio), 2) AS promedio
    FROM rendimiento r
    JOIN tiempo t ON r.id_rendimiento = t.id_tiempo
    GROUP BY t.anio, t.trimestre
    ORDER BY t.anio, t.trimestre
  `,
  'cantidad-por-grado': `
    SELECT g.nivel AS grado, COUNT(*) AS cantidad
    FROM rendimiento r
    JOIN grado g ON r.id_grado = g.id_grado
    GROUP BY g.nivel
  `,
};

export default async function handler(req, res) {
  const tipo = req.query.tipo;

  if (!tipo || !(tipo in queries)) {
    return res.status(400).json({
      error: 'Tipo de reporte inválido',
      opciones: Object.keys(queries),
    });
  }

  try {
    const data = await sql.unsafe(queries[tipo]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Error al ejecutar el reporte',
      detalle: error.message,
    });
  }
}
