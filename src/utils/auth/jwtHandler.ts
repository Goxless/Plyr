import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const defaultAccessTTL: string = '2h';
const defaultRefreshTTL: string = '30d';   

const jwtAccessSignature = <string>process.env.JWT_ACCESS_SIGNATURE;
const jwtRefreshSignature = <string>process.env.JWT_REFRESH_SIGNATURE;

/**
    * Synchronously sign the given payload into a JSON Web Token string payload - Payload to sign, could be an literal, buffer or string secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA.
    * @param payload 
    * @param [expiresIn = default TTL parameter]
    * @returns signed object
*/
export function generateAccessToken(payload: object, expirationTime:string = defaultAccessTTL): string {
    return jwt.sign(payload, jwtAccessSignature, { expiresIn: expirationTime});
};

/**
    * Synchronously sign the given payload into a JSON Web Token string payload - Payload to sign, could be an literal, buffer or string secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA.
    * @param payload 
    * @param [expiresIn = default TTL parameter]
    * @returns signed object
*/
export function generateRefreshToken(payload: object, expirationTime:string = defaultRefreshTTL): string {
    return jwt.sign(payload, jwtRefreshSignature, { expiresIn: expirationTime});
};

/**
    * generates both access and refresh tokens 
    * @param payload 
    * @param [expiresIn(access) = default TTL parameter]
    * @param [expiresIn(refresh) = default TTL parameter]
    * @returns object including access and refresh tokens
*/
export function generateBothTokens (  payload: object, 
                            accessTokenExpiresIn:string = defaultAccessTTL,
                            refreshTokenExpiresIn:string = defaultRefreshTTL): {accessToken:string,refreshToken:string,accessExpiration:string,refreshExpiration:string} {
    return {
        accessToken: jwt.sign(payload, jwtAccessSignature, { expiresIn: accessTokenExpiresIn}),
        refreshToken: jwt.sign(payload,jwtRefreshSignature , { expiresIn: refreshTokenExpiresIn}),
        accessExpiration:accessTokenExpiresIn,
        refreshExpiration:refreshTokenExpiresIn
    };
};

/**
    * Synchronously verify given token using a secret or a public key to get a decoded token token - JWT string to verify secretOrPublicKey - Either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA
    * @param token
    * @returns decoded token or undefined value
*/
export function verifyAccessToken (token: string): string | undefined {
    const decoded = jwt.verify(token, jwtAccessSignature);
    return <string>decoded;
};

/**
    * hashes password :/
    * @param password
    * @returns promise 
*/
export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
};

/**
    * compares given password with hashed value
    * @param password
    * @param hash
    * @returns promise
*/  
export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
};
