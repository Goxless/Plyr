/** @module npm */
import { hash, compare } from 'bcrypt';

/** @module config */
import { config } from '@config';

export const hashPassword = (password: string): Promise<string> => hash(password, config.hash.salt);

export const checkPassword = (pass: string, hash: string): Promise<boolean> => compare(pass, hash);
