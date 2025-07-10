const AWS = require('aws-sdk');
const { dynamo } = require('../aws-config');

const getPatientByEmail = async (email) => {
  const params = {
    TableName: 'PatientUsers',
    IndexName: 'EmailIndex',
    KeyConditionExpression: '#em = :e',
    ExpressionAttributeNames: {
      '#em': 'email'
    },
    ExpressionAttributeValues: {
      ':e': email 
    }
  };

  try {
    const result = await dynamo.query(params).promise();
    console.log("DynamoDB query result:", result); // 🔍 Add this line
    return result.Items[0] || null;
  } catch (error) {
    console.error("DynamoDB query error:", error); // 🔥 Add error logging too
    return null;
  }
};

module.exports = { getPatientByEmail };
