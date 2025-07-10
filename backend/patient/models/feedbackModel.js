const { dynamo } = require('../../aws-config'); // use shared SDK instance

const TABLE_NAME = 'CoachFeedback';

/**
 * Retrieves all feedback entries for a patient.
 */
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