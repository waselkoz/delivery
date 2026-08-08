-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LandingPageConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "formTitle" TEXT NOT NULL DEFAULT 'Ready to Deliver?',
    "formSubtitle" TEXT NOT NULL DEFAULT 'Fill out the form below and we''ll handle the rest.',
    "formButtonText" TEXT NOT NULL DEFAULT 'Submit Request',
    "formBackgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "formTextColor" TEXT NOT NULL DEFAULT '#111827',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_LandingPageConfig" ("createdAt", "id", "primaryColor", "updatedAt") SELECT "createdAt", "id", "primaryColor", "updatedAt" FROM "LandingPageConfig";
DROP TABLE "LandingPageConfig";
ALTER TABLE "new_LandingPageConfig" RENAME TO "LandingPageConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
