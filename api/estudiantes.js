import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  if (req.method === 'GET') {
    const [rows] = await connection.execute('SELECT * FROM estudiante');
    await connection.end();
    return res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    const { nombres, apellidos, genero } = req.body;
    await connection.execute(
      'INSERT INTO estudiante (nombres, apellidos, genero) VALUES (?, ?, ?)',
      [nombres, apellidos, genero]
    );
    await connection.end();
    return res.status(201).json({ message: 'Estudiante registrado' });
  }

  res.status(405).end(); // Método no permitido
}
