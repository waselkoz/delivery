-- Run this in your Supabase SQL Editor to clean up duplicate policies

-- 1. Drop all existing policies to clear duplicates
DROP POLICY IF EXISTS "Allow public inserts" ON "DeliveryRequest";
DROP POLICY IF EXISTS "Allow authenticated full access" ON "DeliveryRequest";
DROP POLICY IF EXISTS "Allow public read" ON "GalleryImage";
DROP POLICY IF EXISTS "Allow authenticated full access" ON "GalleryImage";
DROP POLICY IF EXISTS "Allow public read" ON "LandingPageConfig";
DROP POLICY IF EXISTS "Allow authenticated full access" ON "LandingPageConfig";

-- 2. Recreate only the necessary policies exactly once
CREATE POLICY "Allow public inserts" ON "DeliveryRequest" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON "DeliveryRequest" FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read" ON "GalleryImage" FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access" ON "GalleryImage" FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read" ON "LandingPageConfig" FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access" ON "LandingPageConfig" FOR ALL TO authenticated USING (true);
