export const exclude = (obj: Object, keys: string[]) =>
    Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));
