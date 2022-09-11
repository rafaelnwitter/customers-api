-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
