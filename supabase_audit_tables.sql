-- Run this in your Supabase SQL Editor to create the missing Audit tables

-- 1. Create CompletedDelivery Table
CREATE TABLE IF NOT EXISTS "CompletedDelivery" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "completedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create CancelledDelivery Table
CREATE TABLE IF NOT EXISTS "CancelledDelivery" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "cancelledAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enable RLS and Restrict Access to Authenticated Admins ONLY
ALTER TABLE "CompletedDelivery" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access" ON "CompletedDelivery" FOR ALL TO authenticated USING (true);

ALTER TABLE "CancelledDelivery" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access" ON "CancelledDelivery" FOR ALL TO authenticated USING (true);
