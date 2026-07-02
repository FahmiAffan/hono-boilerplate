import type { Context } from "hono";

export class BaseResponse {
    constructor(public context: Context) { }

    success(message: string, data: object | Array<any> | null | string, code: 200 | 201 | 202 | 203) {
        return this.context.json({
            message: message,
            data: data,
            code: code
        })
    }

    error(message: string, data: object | Array<any> | null | string = null, code: 400 | 404 | 500 = 500) {
        return this.context.json({
            message: message,
            data: data,
            code: code
        }, code)
    }
}