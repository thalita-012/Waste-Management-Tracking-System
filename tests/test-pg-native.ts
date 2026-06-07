import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:nczvLFMrnQpXoYrfAIiPJyXbZBzivGKM@acela.proxy.rlwy.net:21378/railway?sslmode=require",
  ssl: {
    rejectUnauthorized: false  // <-- This tells Node.js to accept self-signed certificates
  }
});

async function testConnection() {
  console.log('Testing PostgreSQL connection...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Railway PostgreSQL!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📅 Database server time:', result.rows[0].current_time);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log('📊 Tables in database:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('📊 No tables found in database');
    }
    
    client.release();
    await pool.end();
    process.exit(0);
    
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();