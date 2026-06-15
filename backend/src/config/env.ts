import dotenv from "dotenv";

dotenv.config();

// Reading config once at startup keeps the rest of the code free of process.env lookups.
function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/propspace"),
  jwtSecret: required("JWT_SECRET", "dev_only_insecure_secret_change_me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
