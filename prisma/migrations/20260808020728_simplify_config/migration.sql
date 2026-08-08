/*
  Warnings:

  - You are about to drop the column `heroImage` on the `LandingPageConfig` table. All the data in the column will be lost.
  - You are about to drop the column `heroSubtitle` on the `LandingPageConfig` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `LandingPageConfig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LandingPageConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LandingPageConfig" ("createdAt", "id", "primaryColor", "updatedAt") SELECT "createdAt", "id", "primaryColor", "updatedAt" FROM "LandingPageConfig";
DROP TABLE "LandingPageConfig";
ALTER TABLE "new_LandingPageConfig" RENAME TO "LandingPageConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
