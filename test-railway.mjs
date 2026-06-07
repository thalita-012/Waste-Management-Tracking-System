import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'acela.proxy.rlwy.net',
  port: 21378,
  user: 'postgres',
  password: 'nczvLFMrnQpXoYrfAIiPJyXbZBzivGKM',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  console.log('Connecting to Railway PostgreSQL...');
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW() as now');
    console.log('📅 Server time:', result.rows[0].now);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Tables:', tables.rows.map(r => r.table_name).join(', ') || 'none');
    
    await client.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

test();