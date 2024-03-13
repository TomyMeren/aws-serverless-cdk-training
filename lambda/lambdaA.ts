import {S3Event} from 'aws-lambda';

export const handler = async function(event: S3Event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
};
