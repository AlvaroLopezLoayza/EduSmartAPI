import sql from './db.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const docentes = await sql`SELECT * FROM docente`
      return res.status(200).json(docentes)
    }

    if (req.method === 'POST') {
      let body = ''
      for await (const chunk of req) body += chunk
      const { nombres, especialidad } = JSON.parse(body)

      if (!nombres) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
      }

      await sql`
        INSERT INTO docente (nombres, especialidad)
        VALUES (${nombres}, ${especialidad})
      `
      return res.status(201).json({ mensaje: 'Docente registrado' })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message })
  }
}
