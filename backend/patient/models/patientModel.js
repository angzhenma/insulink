
 // author: Mohamed Yanaal Iqbal
const AWS = require('aws-sdk');
const { dynamo } = require('../aws-config');

const getPatientByEmail = async (email) => {
  const params = {
    TableName: 'Patients',
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

module.exports = { getPatientByEmail };
