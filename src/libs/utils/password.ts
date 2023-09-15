/** @module npm */
import { hash, compare } from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => hash(password, 10);

export const checkPassword = (pass: string, hash: string): Promise<boolean> => compare(pass, hash);
