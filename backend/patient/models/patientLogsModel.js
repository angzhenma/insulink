  
 // author: Mohamed Yanaal Iqbal
  const { v4: uuidv4 } = require('uuid');
  const { dynamo } = require('../aws-config'); 
  const TABLE_NAME = 'PatientHealthLogs';


  const logHealthData = async (patientId, logData) => {
    const { bloodGlucose, foodIntake, physicalActivity } = logData;

    const item = {
      id: uuidv4(),
      patientId,
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


  const getHealthLogs = async (patientId) => {
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'patientId = :pid',
      ExpressionAttributeValues: {
        ':pid': patientId,
      },
    };

    const data = await dynamo.scan(params).promise();
    return data.Items || [];
  };

  module.exports = {
    logHealthData,
    getHealthLogs,
  };