import type { defaultEnvOptions } from "@/libs/interfaces/envOptions";
import { isNullOrUndef } from "./isNullOrUndef";


export const getEnvVariable = (
    variableName: string,
    options: defaultEnvOptions = { isRequired: true }
): string => {
    const value = process.env[variableName];

    if (isNullOrUndef(variableName) && options.isRequired) {
        console.error(`ENV variable ${variableName} required`);
        process.exit(1);
    }

    return value!;
};
