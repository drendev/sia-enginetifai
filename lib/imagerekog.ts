import AWS from 'aws-sdk';

const awsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update(awsConfig);

export const rekognition = new AWS.Rekognition();
