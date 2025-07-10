const { dynamo } = require('../aws-config');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'PatientReminders';

const addReminder = async (userId, title, time) => {
  const reminder = {
    id: uuidv4(),
    patientId: userId,
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

const getReminders = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':pid': userId,
    },
  };

  const result = await dynamo.scan(params).promise();
  return result.Items || [];
};

const updateReminder = async (userId, id, title, time) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET title = :t, time = :tm',
    ConditionExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':t': title,
      ':tm': time,
      ':pid': userId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamo.update(params).promise();
  return result.Attributes;
};

const deleteReminder = async (userId, id) => {
  const getParams = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  const data = await dynamo.get(getParams).promise();
  if (!data.Item || data.Item.patientId !== userId) return null;

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