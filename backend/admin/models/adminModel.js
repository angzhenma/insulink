// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const AWS = require('aws-sdk');
const { dynamo } = require('../../shared/aws-config');

const getAdminByEmail = async (email) => {
  const params = {
    TableName: 'Admins',
    Key: { email }
  };

  try {
    const result = await dynamo.get(params).promise();
    console.log("DynamoDB get result:", result);
    return result.Item || null;
  } catch (error) {
    console.error("DynamoDB get error:", error);
    return null;
  }
};

module.exports = { getAdminByEmail };