import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class XebiaServerlesCdkTrainingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rawBucket = new s3.Bucket(this, 'raw-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const lambdaA = new NodejsFunction (this, 'lambdaA', {
      entry: './lambda/lambdaA.ts',
    });

    lambdaA.addToRolePolicy(new PolicyStatement({
      sid: "permisionToObjectInsideBucket",
      resources:[rawBucket.arnForObjects('*')],
      effect: Effect.ALLOW,
      actions: ["s3:GetObject"]
    })
    );

    const source = new S3EventSource(rawBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    });

    lambdaA.addEventSource(source);

    const inputBucket = new s3.Bucket(this, 'input-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    inputBucket.grantPut(lambdaA); // is this line necessary?

    const failureBucket = new s3.Bucket(this, 'failure-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    failureBucket.grantPut(lambdaA); // is this line necessary?

  }
}
