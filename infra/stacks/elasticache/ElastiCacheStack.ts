import { App, Stack, StackProps } from 'aws-cdk-lib';
import { CfnCacheCluster, CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';
import { StringParameter, ParameterTier } from 'aws-cdk-lib/aws-ssm';
import { Vpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

import { CACHE_CONFIG } from './config';

export interface CacheStackProps extends StackProps {
  vpc: Vpc;
}

/**
 * Creates a Cloudformation Stack with ElastiCache resource with Redis engine.
 *
 * @see [CloudFormation Stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html)
 * @see [ElastiCache - Redis](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html)
 *
 * @category Stack
 */
export class ElastiCacheStack extends Stack {
  protected stage: string = 'dev';

  public vpc: Vpc;

  /**
   * @inheritdocs
   */
  public constructor(scope: App, id: string, props: CacheStackProps) {
    super(scope, id, props);
    this.stage = 'dev';
    this.vpc = props.vpc;

    new CfnSubnetGroup(this, CACHE_CONFIG.subnetGroupName, {
      cacheSubnetGroupName: CACHE_CONFIG.subnetGroupName,
      description: `Primary subnet group for redis cluster on: ${this.stage}`,
      subnetIds: this.vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    const vpcSecurityGroup = new SecurityGroup(this, 'vpc-security-group-for-cluster', {
      securityGroupName: CACHE_CONFIG.securityGroupName,
      vpc: this.vpc,
    });

    const cacheCluster = new CfnCacheCluster(this, 'primary-cache-cluster', {
      clusterName: 'primary-cache-cluster',
      cacheNodeType: 'cache.t4g.micro',
      engine: 'redis',
      numCacheNodes: 1, // because engine type is redis
      autoMinorVersionUpgrade: true,
      networkType: 'ipv4',
      cacheSubnetGroupName: CACHE_CONFIG.subnetGroupName,
      vpcSecurityGroupIds: [vpcSecurityGroup.securityGroupId],
    });

    /**
     * Optionally: Save elasticache endpoint to the parameter store.
     */
    new StringParameter(this, 'primary-elasticache-endpoint', {
      parameterName: CACHE_CONFIG.PRIMARY_ELASTICACHE_ENDPOINT,
      stringValue: cacheCluster.attrRedisEndpointAddress,
      description: `${this.stage.toUpperCase()} - Primary ElastiCache endpoint`,
      tier: ParameterTier.STANDARD,
    });
  }
}
