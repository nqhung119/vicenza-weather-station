-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temp_room" REAL NOT NULL,
    "hum_room" REAL NOT NULL,
    "temp_out" REAL NOT NULL,
    "lux" REAL NOT NULL,
    "ldr_raw" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
