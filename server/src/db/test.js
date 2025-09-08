const pool = require('./pool');

async function testDB() {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('Database connected, current time:', rows[0].now);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

testDB();
