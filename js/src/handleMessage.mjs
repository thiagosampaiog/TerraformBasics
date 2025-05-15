const bucketName = process.env.MESSAGES_BUCKET;

s3_client = resource('s3')

export const handler = async (event, context) => {
    console.log('Event:', JSON.stringify(event));
    console.log('Bucket name:', bucketName);
    
    const method = event.requestContext?.http?.method;
    console.log('HTTP Method:', method);
    
    // handle get requests
    if (method === 'GET') {
        return get_messages();
    }

     if (method === 'POST') {
        return post_message(event);
    } 
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Unsupported method'
        })
    };
};

function get_messages() {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: 'Hello Lambda!'
        })
    };
}

function post_message(event){
    if ('body' in event) {
        const body = JSON.parse(event.body);
        const message = body.message;
        if (message) {
            const key = new Date().toISOString();
            const data = s3_client.putObject({
                Bucket: bucketName,
                Key: key,
                Body: message
            }).promise();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Message saved'
                })
            };
        }
    }
}
