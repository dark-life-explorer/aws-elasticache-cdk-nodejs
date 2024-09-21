import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { StringParameter, ParameterTier } from 'aws-cdk-lib/aws-ssm';

/**
 * Creates a Cloudformation Stack with VPC resource.
 *
 * @see [CloudFormation Stack](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-stack.html)
 * @see [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
 *
 * @category Stack
 */
export class VPCStack extends Stack {
  protected stage: string;

  public primaryVPC: Vpc;

  /**
   * @inheritdocs
   */
  public constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    this.stage = 'dev';

    /**
     * Create VPC resource
     */
    this.primaryVPC = new Vpc(this, 'PrimaryVPC', {
      vpcName: 'PrimaryVPC',
      maxAzs: 2,
      ipAddresses: IpAddresses.cidr('10.0.16.0/20'),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'privateSubnet',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'publicSubnet',
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    /**
     * Optionally: Save VPC name to the parameter store.
     */
    new StringParameter(this, 'primary-vpc-name', {
      parameterName: `/media-vpc-name`,
      stringValue: 'PrimaryVPC',
      description: 'Primary VPC Name',
      tier: ParameterTier.STANDARD,
    });
  }
}
