const { Client } = require('pg');

const connectionString = "postgresql://postgres.wrsdqjncuhnqrnuhavwe:waselkoz2007.@aws-0-eu-central-1.pooler.supabase.com:5432/postgres";

const client = new Client({
  connectionString,
});

async function run() {
  await client.connect();
  
  const query = `
    CREATE TABLE IF NOT EXISTS "LandingPage" (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "slug" TEXT UNIQUE NOT NULL,
      "title" TEXT NOT NULL,
      "subtitle" TEXT NOT NULL,
      "buttonText" TEXT NOT NULL DEFAULT 'إرسال الطلب',
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE "DeliveryRequest" ADD COLUMN IF NOT EXISTS "landingPageId" UUID REFERENCES "LandingPage"("id") ON DELETE SET NULL;
    ALTER TABLE "CompletedDelivery" ADD COLUMN IF NOT EXISTS "landingPageId" UUID REFERENCES "LandingPage"("id") ON DELETE SET NULL;
    ALTER TABLE "CancelledDelivery" ADD COLUMN IF NOT EXISTS "landingPageId" UUID REFERENCES "LandingPage"("id") ON DELETE SET NULL;
    ALTER TABLE "GalleryImage" ADD COLUMN IF NOT EXISTS "landingPageId" UUID REFERENCES "LandingPage"("id") ON DELETE CASCADE;
    
    ALTER TABLE "LandingPage" ENABLE ROW LEVEL SECURITY;
    
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'LandingPage' AND policyname = 'Allow public read') THEN
        CREATE POLICY "Allow public read" ON "LandingPage" FOR SELECT TO public USING (true);
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'LandingPage' AND policyname = 'Allow authenticated full access') THEN
        CREATE POLICY "Allow authenticated full access" ON "LandingPage" FOR ALL TO authenticated USING (true);
      END IF;
    END
    $$;
  `;

  try {
    await client.query(query);
    console.log("Migration successful");
  } catch(err) {
    console.error("Migration failed", err);
  } finally {
    await client.end();
  }
}

run();
