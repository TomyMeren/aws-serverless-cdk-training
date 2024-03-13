import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class XebiaServerlesCdkTrainingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rawBucket = new s3.Bucket(this, 'raw-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const lambdaA = new lambda.Function(this, 'lambda-A', {
      runtime: lambda.Runtime.NODEJS_16_X ,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'lambdaA.handler'      
    });

    const source = new S3EventSource(rawBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    });

    lambdaA.addEventSource(source);
  }
}
