-- Supabase Database Schema

-- 1. Create DeliveryRequest Table
CREATE TABLE IF NOT EXISTS "DeliveryRequest" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create GalleryImage Table
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create LandingPageConfig Table
CREATE TABLE IF NOT EXISTS "LandingPageConfig" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "formTitle" TEXT NOT NULL DEFAULT 'Ready to Deliver?',
    "formSubtitle" TEXT NOT NULL DEFAULT 'Fill out the form below and we''ll handle the rest.',
    "formTextColor" TEXT NOT NULL DEFAULT '#111827',
    "formButtonColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "formButtonText" TEXT NOT NULL DEFAULT 'Submit Request',
    "formButtonHoverColor" TEXT NOT NULL DEFAULT '#4338CA',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default config row if it doesn't exist
INSERT INTO "LandingPageConfig" ("id", "createdAt", "updatedAt")
SELECT uuid_generate_v4(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "LandingPageConfig");

-- Set up Row Level Security (RLS) to allow public inserts for DeliveryRequest
ALTER TABLE "DeliveryRequest" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON "DeliveryRequest" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON "DeliveryRequest" FOR ALL TO authenticated USING (true);

-- Allow public read access to Gallery and Config
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON "GalleryImage" FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access" ON "GalleryImage" FOR ALL TO authenticated USING (true);

ALTER TABLE "LandingPageConfig" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON "LandingPageConfig" FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access" ON "LandingPageConfig" FOR ALL TO authenticated USING (true);
