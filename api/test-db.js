import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });

    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    await connection.end();

    res.status(200).json({ connected: true, test_result: rows[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      connected: false,
      error: err.message
    });
  }
}
