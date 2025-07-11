
 // author: Mohamed Yanaal Iqbal
const { dynamo } = require('../aws-config');

const TABLE_NAME = 'CoachFeedback';

const getFeedbackForPatient = async (patientId) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':pid': patientId,
    },
  };

  const result = await dynamo.scan(params).promise();
  return result.Items || [];
};

module.exports = { getFeedbackForPatient };