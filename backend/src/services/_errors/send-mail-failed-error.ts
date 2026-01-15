export class SendMailFailedError extends Error{
    constructor(){
        super('Ocured an error while the e-mail was sended')
        statusCode: 502
    }
}