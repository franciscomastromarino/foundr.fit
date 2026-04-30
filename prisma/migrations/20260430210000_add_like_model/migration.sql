-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "fromUser" TEXT NOT NULL,
    "toUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Like_fromUser_idx" ON "Like"("fromUser");

-- CreateIndex
CREATE INDEX "Like_toUser_idx" ON "Like"("toUser");

-- CreateIndex
CREATE UNIQUE INDEX "Like_fromUser_toUser_key" ON "Like"("fromUser", "toUser");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_fromUser_fkey" FOREIGN KEY ("fromUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_toUser_fkey" FOREIGN KEY ("toUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
