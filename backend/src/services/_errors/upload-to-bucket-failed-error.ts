export class UploadToBucketFailedError extends Error{
    constructor(){
        super('Ocured an error while the file was uploaded to the bucket')
        statusCode: 502
    }
}