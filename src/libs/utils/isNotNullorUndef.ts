import { isNullOrUndef } from './isNullOrUndef';

export const isNotNullOrUndef = (value: any): boolean => {
    return !isNullOrUndef(value);
};
