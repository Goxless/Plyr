export default {
    //app settings
    port: '8000',
    ip: '192.168.1.2',

    // databases settings
    PG_URL: 'postgresql://${PG_USER}:${PG_PASSWORD}@${PG_DATABASE_URL}:${PG_DATABASE_PORT}/${PG_DB_NAME}',
    pgDatabaseUrl: '192.168.1.5',
    pgDatabasePort: '5432',
    pgDbName: 'MKTplcDB',
    pgUser: 'root',
    pgPassword: 'root',

    //cache (redis) setting
    redisUrl: '192.168.1.5',
    redisPort: '6379',
    redisClientName: 'default',
    redisClientPass: '',

    //JWT settings
    jwtAccessSignature: "FWu(G:rtUmbTVX6)d(h2Ys}^nXo/j,yfeio26uI|T+P'W>om]be*HpH<>:.2G=W",
    jwtRefreshSignature:
        'FlpqlwD1c~0CJz{t~j8jRWxOEI58l?7gBFo$Qr%76IkhVH%v*~0vbtmgd$gruRwFh*BXikd4Oz*YgsRfKuOePO6QX%v6jpoZjr9bz*c}qP|FaiRxW$NqKm%qCYB//WbTgH5WWqaQImGl{pefz$7oYJBX4~KV8td}~mR7}hW%~Ps5es{4BxvyZ{sFRpPwIz9hN3R28Qg@FnEf?',
    jwtDefaultAccessTTL: '2h',
    jwtDefaultRefreshTTL: '30d',

    //Mailer settings
    smtpHost: 'smtp.timeweb.ru',
    smtpPort: '465',
    mailerUser: 'kirill@voloshinp.ru',
    mailerPass: 'gfhjkm111',
};
