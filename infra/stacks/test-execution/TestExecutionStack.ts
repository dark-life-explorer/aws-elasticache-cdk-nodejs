import { App, Stack, StackProps } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Vpc, SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { CACHE_CONFIG } from '../elasticache/config';

/**
 * Creates a Cloudformation Stack with a Lambda resource residing in primary vpc and accessing elasticache.
 *
 * @see [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
 *
 * @category Stack
 */
export class TestExecutionStack extends Stack {
  protected stage: string = 'dev';

  public primaryVPC: Vpc;

  /**
   * @inheritdocs
   */
  public constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);
    this.stage = 'dev';

    /**
     * Looking for an existing VPC by it's name
     */
    const primaryVpc = Vpc.fromLookup(this, 'external-vpc', {
      vpcName: 'PrimaryVPC', // here the name of the vpc created within VPC Stack
    });

    /**
     * Creates security group for the test lambda.
     */
    const lambdaSG = new SecurityGroup(this, 'test-lambda-sg', {
      vpc: primaryVpc,
      allowAllOutbound: true,
    });

    /**
     * Looking for a Redis security group created within ElastiCache stack.
     */
    const redisSecurityGroup = SecurityGroup.fromLookupByName(
      this,
      'elasticache-security-group',
      CACHE_CONFIG.securityGroupName,
      primaryVpc,
    );

    redisSecurityGroup.addIngressRule(Peer.securityGroupId(lambdaSG.securityGroupId), Port.tcp(6379));

    /**
     * Looking for a Redis endpoint created within ElastiCache stack.
     */
    const redisEndpoint = StringParameter.fromStringParameterName(
      this,
      'elasticache-endpoint-id',
      CACHE_CONFIG.PRIMARY_ELASTICACHE_ENDPOINT,
    ).stringValue;

    /**
     * Create Test Lambda and place it into Primary VPC and add security group to access ElastiCache.
     */
    new NodejsFunction(this, 'lambda-test', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: `${__dirname}/../../../src/index.ts`,
      functionName: 'TestElastiCacheHAndler',
      description: props?.description,
      retryAttempts: 1,
      bundling: {
        minify: true,
      },
      environment: {
        ELASTICACHE_ENDPOINT: redisEndpoint,
      },
      vpc: primaryVpc,
      securityGroups: [lambdaSG],
    });
  }
}
