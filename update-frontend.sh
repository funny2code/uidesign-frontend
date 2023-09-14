#!/bin/bash
# Updates contents in bucket and invalidates cloudfront cache.
# The bucket can only be accessed via IAM or CloudFront.
BUCKET=uichain-website-2
CLOUDFRONT=E2DKZHUL2GLM0F
PROFILE=damidev
npm run build && aws s3 sync ./dist/ s3://$BUCKET/ --profile $PROFILE
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT --paths "/" --profile $PROFILE