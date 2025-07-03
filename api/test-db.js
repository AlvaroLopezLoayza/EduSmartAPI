import sql from './db.js';

export default async function handler(req, res) {
  try {
    const result = await sql`SELECT 1 AS prueba_conexion`;
    res.status(200).json({
      connected: true,
      result: result[0].prueba_conexion
    });
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
}
