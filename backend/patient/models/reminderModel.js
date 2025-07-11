
 // author: Mohamed Yanaal Iqbal
const { dynamo } = require('../aws-config');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'PatientReminders';

const addReminder = async (patientId, title, time) => {
  const reminder = {
    id: uuidv4(),
    patientId: patientId,
    title,
    time,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: reminder,
  };

  await dynamo.put(params).promise();
  return reminder;
};

const getReminders = async (patientId) => {
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

const updateReminder = async (patientId, id, title, time) => {
  const getParams = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const existing = await dynamo.get(getParams).promise();
  if (!existing.Item || existing.Item.patientId !== patientId) return null;

  const updateParams = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET title = :t, #tm = :tm',
    ExpressionAttributeNames: {
      '#tm' : 'time',
    },

    ExpressionAttributeValues: {
      ':t': title,
      ':tm': time,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamo.update(updateParams).promise();
  return result.Attributes;
};

const deleteReminder = async (patientId, id) => {
  const getParams = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const data = await dynamo.get(getParams).promise();
  if (!data.Item || data.Item.patientId !== patientId) return null;

  const deleteParams = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  await dynamo.delete(deleteParams).promise();
  return true;
};

module.exports = {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
};
