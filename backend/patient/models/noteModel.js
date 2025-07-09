
const { dynamo } = require('../aws-config');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'PatientNotes';

const addNote = async (userId, content) => {
  const note = {
    id: uuidv4(),
    patientId: userId,
    content,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: TABLE_NAME,
    Item: note,
  };

  await dynamo.put(params).promise();
  return note;
};

const getNotes = async (userId) => {
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

const updateNote = async (userId, id, content) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET content = :c',
    ConditionExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':c': content,
      ':pid': userId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamo.update(params).promise();
  return result.Attributes;
};

const deleteNote = async (userId, id) => {
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
  addNote,
  getNotes,
  updateNote,
  deleteNote,
};
