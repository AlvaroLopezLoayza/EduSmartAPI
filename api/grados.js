import sql from './db.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const grados = await sql`SELECT * FROM grado`
      return res.status(200).json(grados)
    }

    if (req.method === 'POST') {
      let body = ''
      for await (const chunk of req) body += chunk
      const { nivel } = JSON.parse(body)

      if (!nivel) {
        return res.status(400).json({ error: 'Falta el campo "nivel"' })
      }

      await sql`
        INSERT INTO grado (nivel)
        VALUES (${nivel})
      `
      return res.status(201).json({ mensaje: 'Grado registrado' })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message })
  }
}
