const { Client } = require('pg');

async function clean() {
  const connectionString = "postgresql://postgres.wrsdqjncuhnqrnuhavwe:waselkoz2007.@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    console.log("Deleting CancelledDelivery...");
    await client.query('DELETE FROM "CancelledDelivery"');
    
    console.log("Deleting CompletedDelivery...");
    await client.query('DELETE FROM "CompletedDelivery"');
    
    console.log("Deleting DeliveryRequest...");
    await client.query('DELETE FROM "DeliveryRequest"');
    
    console.log("All test delivery records purged.");
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

clean();
