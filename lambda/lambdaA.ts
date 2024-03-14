import * as AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

export async function handler(event: S3Event): Promise<any> {
  const s3 = new AWS.S3();

  const inputBucketName = 'xebiaserverlescdktrainingstack-inputbucket08d572f4-qvqfnssroxgn';
  const failBucketName = 'xebiaserverlescdktrainingsta-failurebucket4b3e4892-r8rqpkovpiqv';

  for (const record of event.Records) {
    const key = record.s3.object.key;

    try {
      // Retrieve file from S3
      const params = {
        Bucket: record.s3.bucket.name,
        Key: key,
      };

      const data = await s3.getObject(params).promise();
      const body = data.Body as Buffer;

      //Check if the file cointains the word "Hello"
      if (body.toString().includes('Hello')) {
        // Save file to another bucket after zip
        // Zip file
        const zippedData = await gzip(data.Body as Buffer);

        const uploadParams = {
          Bucket: inputBucketName,
          Key: key + '.gz',
          Body: zippedData,
        };

        await s3.putObject(uploadParams).promise();
      } else {
        // Save file to another bucket
        const uploadParams = {
          Bucket: failBucketName,
          Key: key,
          Body: data.Body,
        };

        await s3.putObject(uploadParams).promise();
      }
    } catch (error) {
      console.error(`Failed to process ${key}: ${error}`);
    }
  }
} 