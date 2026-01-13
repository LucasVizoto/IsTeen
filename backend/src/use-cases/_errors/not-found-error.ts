export class NotFoundError extends Error{
    constructor(){
        super('Resource Not Found')
        statusCode: 404
    }
}