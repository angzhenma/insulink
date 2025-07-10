
const { dynamo } = require('../../aws-config');

const getPatientByEmail = async (email) => {
  const params = {
    TableName: 'Patients',
    IndexName: 'EmailIndex',
    KeyConditionExpression: 'email = :e',
    ExpressionAttributeValues: {
      ':e': email
    }
  };

  const result = await dynamo.query(params).promise();
  return result.Items[0]; 
};

module.exports = { getPatientByEmail };
