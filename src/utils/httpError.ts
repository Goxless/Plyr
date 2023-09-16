export class httpError extends Error {
    status: number = 500;

    constructor(status: number, msg: string) {
        super(msg);
        this.status = status;
    }
}
