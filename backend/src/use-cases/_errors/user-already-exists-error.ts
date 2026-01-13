export class UserAlreadyExistsError extends Error{
    constructor(){
        super('User already exists')
        statusCode: 409
    }
}