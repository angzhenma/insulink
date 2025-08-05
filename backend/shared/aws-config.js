// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const AWS = require('aws-sdk');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION || 'us-east-1'
});

// initialize dynamoDB and SNS client
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

module.exports = {
  dynamo,
  sns,
};