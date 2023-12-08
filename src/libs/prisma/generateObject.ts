import { ParsedUrlQuery } from 'querystring';

export const generateWhere = (fields: String[], params: ParsedUrlQuery): Object => {
    const obj: any= {
            AND: {},
    };

    for (let item in params) {
        if (fields.includes(item)) {
            obj.AND[item] = params[item];
        }
    }

    return obj;
};
