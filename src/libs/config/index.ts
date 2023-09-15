export default {
    defaultAccessTTL:'2h',
    defaultRefreshTTL: '30d',
    jwtAccessSignature : <string>process.env.JWT_ACCESS_SIGNATURE,
    jwtRefreshSignature : <string>process.env.JWT_REFRESH_SIGNATURE,
}
// config 