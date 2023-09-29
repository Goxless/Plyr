export class HttpError extends Error {
    status: number;

    constructor( msg: string, status = 400) {
        super(msg);
        this.status = status;
    }
}
