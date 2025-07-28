import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { filename, content, language } = await req.json();

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        language VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(
      `INSERT INTO files (filename, content, language)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content), language = VALUES(language)`,
      [filename, content, language]
    );

    await conn.end();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("MySQL error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
