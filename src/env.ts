import "dotenv/config";

export const API_PORT = process.env.API_PORT ?? 3000;
export const DB_URL = process.env.DB_URL ?? "local.db";
