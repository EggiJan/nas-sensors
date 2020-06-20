const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-central-1',
});

/**
 * @type {AWS.DynamoDB.DocumentClient}
 */
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

/**
 * @param {AWS.DynamoDB} dynamoDB 
 * @param {string} tableName
 */
const client = (dynamoDB, tableName) => {

  /**
   * @param {{start: string, end: string}} query
   * @returns {Promise<AWS.DynamoDB.ScanOutput>}
   */
  const scan = (query) => {

    /** @type {AWS.DynamoDB.ScanInput} */
    const params = {
      TableName: tableName,
      FilterExpression: '#TS between :start and :end',
      ExpressionAttributeNames: {
        '#TS': 'Timestamp'
      },
      ExpressionAttributeValues: {
        ':start': query.start,
        ':end': query.end
      },
      Select: 'ALL_ATTRIBUTES',
    };

    return dynamoDB.scan(params).promise();
  };

  /**
   * @param {object} query 
   * @returns {Promise<AWS.DynamoDB.GetItemOutput>}
   */
  const get = (query) => {

    /** @type {AWS.DynamoDB.GetItemInput} */
    const params = {
      Key: query,
      TableName: tableName
    };

    return dynamoDB.get(params).promise();
  };

  /**
   * @param {object} query
   * @returns {Promise<AWS.DynamoDB.PutItemOutput>} 
   */
  const put = (query) => {

    /** @type {AWS.DynamoDB.PutItemInput} */
    const params = {
      Item: query,
      TableName: tableName
    };

    return dynamoDB.put(params).promise();
  };
  
  /**
   * @param {{start: string, end: string}} query
   * @returns {Promise<AWS.DynamoDB.QueryOutput>} 
   */
  const query = (query) => {

    /** @type {AWS.DynamoDB.QueryInput} */
    const params = {
      KeyConditionExpression: '#TS between :start and :end',
      ExpressionAttributeNames: {
        '#TS': 'Timestamp'
      },
      ExpressionAttributeValues: {
        ':start': query.start,
        ':end': query.end
      },
      TableName: tableName,
      Select: 'ALL_ATTRIBUTES'
    };

    return dynamoDB.query(params).promise();
  };


  return Object.seal({
    get,
    put,
    scan,
    query,
  });
}

module.exports = Object.seal({
  dynamoDB: client(dynamoDB, TABLE_NAME)
});