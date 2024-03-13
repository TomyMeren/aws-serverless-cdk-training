import {S3Event} from 'aws-lambda';
import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';

const s3Client = new S3Client();

export const handler = async function(event: S3Event) {
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = event.Records[0].s3.object.key;

    // S3 get object

    const response = await s3Client.send(
        new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    })
    );

    const body = await response.Body?.transformToString();

    console.log("The file HelloWordFile.txt was uploaded to the bucket " + bucketName + " and the content is: " + body);
};
