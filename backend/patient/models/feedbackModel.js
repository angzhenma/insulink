// models/feedbackModel.js
const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'CoachFeedback';

const getFeedbackForPatient = async (patientId) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':pid': patientId,
    },
  };

  const result = await dynamoDB.scan(params).promise();
  return result.Items || [];
};

module.exports = { getFeedbackForPatient };
