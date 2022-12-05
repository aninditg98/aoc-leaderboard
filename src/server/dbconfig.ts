import { PoolConfig } from 'pg';
const env = process.env;
export const config: PoolConfig = {
    /* do not put password or any sensitive info here, done only for demo */
    host: env.DB_HOST || 'babar.db.elephantsql.com',
    port: 5432,
    user: env.DB_USER || 'ywhssgwm',
    password: env.DB_PASSWORD || 'WhpcAQANwRyOliThxPueCUjJHFPl_wse',
    database: env.DB_NAME || 'ywhssgwm',
};
