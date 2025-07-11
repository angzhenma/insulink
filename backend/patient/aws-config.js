
 // author: Mohamed Yanaal Iqbal
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports = { dynamo, s3 };
