-- Run this in your Supabase SQL Editor to allow image uploads!

-- 1. Enable authenticated users to upload files to the gallery bucket
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'gallery');

-- 2. Enable authenticated users to delete/update files in the gallery bucket
CREATE POLICY "Allow authenticated update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'gallery');

-- 3. Ensure everyone (public) can view the images
CREATE POLICY "Allow public read" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'gallery');
