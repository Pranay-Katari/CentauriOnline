import mysql from "mysql2/promise";

export async function GET() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.execute("SELECT filename, content, language FROM files");
    await conn.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("MySQL error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
