import * as cdk from 'aws-cdk-lib';
import { XebiaServerlesCdkTrainingStack } from '../lib/xebia_serverles_cdk_training-stack';

const app = new cdk.App();
new XebiaServerlesCdkTrainingStack(app, 'XebiaServerlesCdkTrainingStack');
