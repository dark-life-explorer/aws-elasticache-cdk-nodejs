/* eslint-disable sonarjs/no-duplicate-string */
export const CACHE_CONFIG = {
  subnetGroupName: 'primary-cache-subnet-group',

  securityGroupName: 'primary-cache-security-group',

  PRIMARY_ELASTICACHE_ENDPOINT: `/primary-elasticache-endpoint`,
};

export const CACHE_VPC_CONFIG = {
  local: {
    availabilityZone: 'us-east-1a',
    cidrBlock: '10.1.2.0/24',
  },
  dev: {
    availabilityZone: 'us-east-1a',
    cidrBlock: '10.1.2.0/24',
  },
  team: {
    availabilityZone: 'us-east-1a',
    cidrBlock: '10.1.3.0/24',
  },
  production: {
    availabilityZone: 'us-east-1a',
    cidrBlock: '10.1.4.0/24',
  },
};
