
 // author: Mohamed Yanaal Iqbal
const { dynamo } = require('../aws-config');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'PatientNotes';

const addNote = async (patientId, content) => {
  const note = {
    id: uuidv4(),
    patientId: patientId,
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

const getNotes = async (patientId) => {
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

const updateNote = async (patientId, id, content) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET content = :c',
    ConditionExpression: 'patientId = :pid',
    ExpressionAttributeValues: {
      ':c': content,
      ':pid': patientId,
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamo.update(params).promise();
  return result.Attributes;
};

const deleteNote = async (patientId, id) => {
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
  addNote,
  getNotes,
  updateNote,
  deleteNote,
};
