import { getEnvVariable } from '@/libs/utils/getEnvVariable';

export const config = {
    //app settings
    app: {
        port: getEnvVariable('APP_PORT'),
        ip: getEnvVariable('APP_IP'),
    },

    // databases settings
    postgres: {
        getConnectionString() {
            return `postgresql://${this.user}:${this.pass}@${this.url}:${this.port}/${this.name}`;
        },
        url: getEnvVariable('PG_DATABASE_URL'),
        port: getEnvVariable('PG_DATABASE_PORT'),
        name: getEnvVariable('PG_DB_NAME'),
        user: getEnvVariable('PG_USER'),
        pass: getEnvVariable('PG_PASSWORD'),
    },

    //cache (redis) setting
    redis: {
        getConnectionString() {
            return `redis://${this.user}:${this.pass}@${this.url}:${this.port}`;
        },

        url: getEnvVariable('REDIS_URL'),
        port: getEnvVariable('REDIS_PORT'),
        user: getEnvVariable('REDIS_CLIENT_NAME'),
        pass: getEnvVariable('REDIS_CLIENT_PASS'),
    },

    //JWT settings
    jwt: {
        accessSignature: getEnvVariable('JWT_ACCESS_SIGNATURE'),
        refreshSignature: getEnvVariable('JWT_REFRESH_SIGNATURE'),
        defaultAccessTTL: '2h',
        defaultRefreshTTL: '30d',
    },

    //Mailer settings
    mailer: {
        host: getEnvVariable('SMTP_HOST'),
        port: getEnvVariable('SMTP_PORT'),
        user: getEnvVariable('MAILER_USER'),
        pass: getEnvVariable('MAILER_PASS'),
    },
};
