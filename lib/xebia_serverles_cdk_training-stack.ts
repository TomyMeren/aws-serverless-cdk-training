import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class XebiaServerlesCdkTrainingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const firstBucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: 'my-first-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const myLambda = new lambda.Function(this, 'lambda-A', {
      runtime: lambda.Runtime.NODEJS_16_X ,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'lambdaA.handler'      
    });
  }
}
