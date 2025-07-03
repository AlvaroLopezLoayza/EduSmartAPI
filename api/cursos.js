import sql from './db.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cursos = await sql`SELECT * FROM curso`
      return res.status(200).json(cursos)
    }

    if (req.method === 'POST') {
      let body = ''
      for await (const chunk of req) body += chunk
      const { nombre, area } = JSON.parse(body)

      if (!nombre) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
      }

      await sql`
        INSERT INTO curso (nombre, area)
        VALUES (${nombre}, ${area})
      `
      return res.status(201).json({ mensaje: 'Curso registrado' })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message })
  }
}
