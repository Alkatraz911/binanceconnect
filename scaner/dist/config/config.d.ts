import 'dotenv/config';
interface Iconfig {
    PORT: string;
    AUTH_MODE: boolean;
    LOG_LEVEL: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_HOST: string;
    POSTGRES_CONTAINERPORT: string;
    JWT_SECRET: string;
}
declare const config: Iconfig;
export default config;
