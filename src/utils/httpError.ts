export class HttpError extends Error {
    status: number;
    details: string;

    constructor(msg: string, status = 400, details: string = '') {
        super(msg);
        this.status = status;
        this.details = details;
    }
}
