-- CreateTable
CREATE TABLE "Coin" (
    "id" SERIAL NOT NULL,
    "coinId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "marketCapRank" INTEGER NOT NULL,
    "priceChangePercentage7dInCurrency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_coinId_key" ON "Coin"("coinId");

-- CreateIndex
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");
