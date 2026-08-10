const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const env = fs.readFileSync('.env', 'utf8');
  const connectionString = env.match(/DATABASE_URL="?(.*?)"?$/m)[1].trim();

  const hash = await bcrypt.hash('King-admin123!', 10);
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query('UPDATE auth.users SET encrypted_password = $1 WHERE email = $2', [hash, 'admin@delv.com']);
  console.log('Password updated for admin@delv.com:', res.rowCount);
  await client.end();
}

run().catch(console.error);
