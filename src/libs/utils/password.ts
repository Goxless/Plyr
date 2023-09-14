/** @module npm */
import { hash, compare } from 'bcrypt';

export const hashPassword = (password: string) => hash(password, 10);

export const checkPassword = (pass: string, hash: string) => compare(pass, hash);
