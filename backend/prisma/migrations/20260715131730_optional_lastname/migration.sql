/*
  Warnings:

  - You are about to alter the column `first_name` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `last_name` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(50);
