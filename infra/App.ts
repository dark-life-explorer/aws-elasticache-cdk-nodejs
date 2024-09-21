import { App } from 'aws-cdk-lib';

import { VPCStack } from './stacks/vpc/VPCStack';
import { ElastiCacheStack } from './stacks/elasticache/ElastiCacheStack';
// import { TestExecutionStack } from './stacks/test-execution/TestExecutionStack';

/**
 * NOTE: Define env variables in pipeline or put them here for testing purposes.
 */
const account = process.env.ACCOUNT; // account id
const region = process.env.REGION;   // a region to deploy the application

const app = new App({ context: {} });

const vpcStack = new VPCStack(app, 'VPC-STACK', {
  env: {
    account,
    region,
  },
});

const elastiCacheStack = new ElastiCacheStack(app, 'ELASTICACHE-STACK', {
  env: {
    account,
    region,
  },
  vpc: vpcStack.primaryVPC,
});
elastiCacheStack.addDependency(vpcStack);

/**
 * Deploy resources stacks first.
 * One's there are deployed this one can be deployed.
 */
/*
const testExecutionStack = new TestExecutionStack(app, 'TEST-EXECUTION-STACK', {
  env: {
    account,
    region,
  },
}); */
