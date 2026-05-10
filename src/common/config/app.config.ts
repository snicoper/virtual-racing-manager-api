export const AppConfig = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresInMinutes: Number(process.env.JWT_EXPIRES_IN_MINUTES ?? 15),
  },
};

export type AppConfig = typeof AppConfig;
