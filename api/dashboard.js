import sql from './db.js';

export default async function handler(req, res) {
  try {
    const [
      estudiantes,
      docentes,
      grados,
      cursos,
      promedioNotas,
      promedioAsistencia
    ] = await Promise.all([
      sql`SELECT COUNT(*) FROM estudiante`,
      sql`SELECT COUNT(*) FROM docente`,
      sql`SELECT COUNT(*) FROM grado`,
      sql`SELECT COUNT(*) FROM curso`,
      sql`SELECT AVG(nota_promedio) FROM rendimiento`,
      sql`SELECT AVG(asistencia) FROM rendimiento`
    ]);

    res.status(200).json({
      estudiantes: parseInt(estudiantes[0].count),
      docentes: parseInt(docentes[0].count),
      grados: parseInt(grados[0].count),
      cursos: parseInt(cursos[0].count),
      promedio_notas: parseFloat(promedioNotas[0].avg || 0).toFixed(2),
      promedio_asistencia: parseFloat(promedioAsistencia[0].avg || 0).toFixed(1)
    });
  } catch (error) {
    console.error("Error en /dashboard:", error);
    res.status(500).json({ error: "Error en el servidor", detalle: error.message });
  }
}
