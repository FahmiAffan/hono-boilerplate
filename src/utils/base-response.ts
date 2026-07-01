import type { Context } from "hono";

export class BaseResponse {
    constructor(public context: Context) { }

    success(message: string, data: object | Array<any>, code: 200 | 201 | 202 | 203) {
        return this.context.json({
            message: message,
            data: data,
            code: code
        })
    }

    error(){
        
    }
}