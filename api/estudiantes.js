import sql from './db.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const estudiantes = await sql`SELECT * FROM estudiante`;
      return res.status(200).json(estudiantes);
    }

    if (req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { nombres, apellidos, genero } = JSON.parse(body);

      if (!nombres || !apellidos || !genero) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      await sql`
        INSERT INTO estudiante (nombres, apellidos, genero)
        VALUES (${nombres}, ${apellidos}, ${genero})
      `;

      return res.status(201).json({ mensaje: 'Estudiante registrado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor', detalle: error.message });
  }
}
