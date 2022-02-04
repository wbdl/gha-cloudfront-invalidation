# Amazon Cloudfront Invalidation Action for GitHub Actions

This Github action will find a cloudfront distribution ID from an FQDN and issue an invalidation against it

**Table of Contents**

<!-- toc -->

- [Usage](#usage)
- [Credentials](#credentials)
- [Permissions](#permissions)

<!-- tocstop -->

## Usage

```yaml
    - name: Login to Amazon ECR
      id: invalidate-cloudfront
      uses: wbdl/gha-cloudfront-invalidation@master
      with:
        target-domain: 'foo.bar.com'
        paths:
        - "/foo"
        - "/bar*"
```

## Credentials

This action relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) to determine AWS credentials and region.
Use [the `aws-actions/configure-aws-credentials` action](https://github.com/aws-actions/configure-aws-credentials) to configure the GitHub Actions environment with environment variables containing AWS credentials and your desired region.

## Permissions

Whichever user or role is executing the action will need the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListDistributions",
      "Action": [
        "cloudfront:ListDistributions"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Sid": "CreateInvalidations",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Effect": "Allow",
      "Resource": [
              "arn:aws:cloudfront::<aws_account_id>:distribution/<cloudfront_distribution_id>"
      ]
    }
  ]
}
```
