-- Run this in your Supabase SQL Editor to instantly secure your database

-- 1. Enable RLS on the old Prisma User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- By enabling RLS and NOT creating any policies, the table is now strictly "Default-Deny". 
-- This completely blocks all public and authenticated access via the API, instantly securing the password column.
