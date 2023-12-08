import { getEnvVariable } from '@/libs/utils/getEnvVariable';
import * as mm from 'music-metadata';

export const config = {
    //app settings
    app: {
        port: getEnvVariable('APP_PORT'),
        ip: getEnvVariable('APP_IP'),
        staticPath: 'static/',
        carriersPaths: new Map<string, string | null>([
            ['body', 'request'],
            ["params", null],
            ['query', null],
            ['files', null],
        ]),
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
        accessSignature: getEnvVariable(
            'JWT_ACCESS_SIGNATURE'
        ),
        refreshSignature: getEnvVariable(
            'JWT_REFRESH_SIGNATURE'
        ),
        defaultAccessTTL: '2h',
        defaultRefreshTTL: '30d',
    },

    //hash setting
    hash: {
        salt: 10,
    },

    //Mailer settings
    mailer: {
        host: getEnvVariable('SMTP_HOST'),
        port: getEnvVariable('SMTP_PORT'),
        user: getEnvVariable('MAILER_USER'),
        pass: getEnvVariable('MAILER_PASS'),
    },
    //music settings
    music: {
        path: 'music/',
        albumImagesPath: 'music/album/images/',
        tracksPath: 'music/track/',
        placeholder: 'placeholder.jpg',
        maxSize: 15 * 1024 * 1024,
        types: [
            'mpeg',
            'apev2',
            'mp4',
            'asf',
            'flac',
            'ogg',
            'aiff',
            'wavpack',
            'riff',
            'musepack',
            'dsf',
            'dsdiff',
            'adts',
            'matroska',
        ],
    },
    //profile settings
    profile: {
        path: 'profile/',
        avatarPath: 'profile/avatar/',
        placeholder: 'placeholder.jpg',
    },
};
