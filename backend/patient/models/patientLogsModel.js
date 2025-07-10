const { v4: uuidv4 } = require('uuid');
const { dynamo } = require('../aws-config'); 
const TABLE_NAME = 'PatientHealthLogs';

/**
 * Logs a new health entry to DynamoDB.
 */
const logHealthData = async (userId, logData) => {
  const { bloodGlucose, foodIntake, physicalActivity } = logData;

  const item = {
    id: uuidv4(),
    patientId: userId,
    bloodGlucose,
    foodIntake,
    physicalActivity,
    timestamp: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  await dynamo.put(params).promise();
  return item;
};

/**
 * Retrieves all health logs for the patient.
 */
const getHealthLogs = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':pid': userId,
    },
  };

  const data = await dynamo.scan(params).promise();
  return data.Items || [];
};

module.exports = {
  logHealthData,
  getHealthLogs,
};