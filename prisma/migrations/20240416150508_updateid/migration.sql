/*
  Warnings:

  - A unique constraint covering the columns `[tranasctionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_tranasctionId_key" ON "payments"("tranasctionId");
