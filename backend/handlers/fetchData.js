const { dynamoDB } = require('../clients/db');

const makeResponse = (statusCode, body) => {
  return {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode,
  }
};

module.exports.handler = async (event) => {

  if (!event.queryStringParameters) {
    return makeResponse(400, {
      error: 'Missing Parameters'
    });
  }

  const {
    secret,
    from = 0,
    to = 0
  } = event.queryStringParameters;

  console.log(`[INFO] params from: ${from} to: ${to}`);

  if (secret !== process.env.SECRET) {
    console.log('[ERROR] Secret mismatch');
    return makeResponse(401, {
      error: 'Wrong Secret'
    });
  }

  const start = (new Date(parseInt(from))).toISOString();
  const end = (new Date(parseInt(to))).toISOString();
  
  console.log('[INFO] query', start, end);
  
  const query = {
    start,
    end
  };

  try {
    const result = await dynamoDB.scan(query);
    
    result.Items = result.Items.sort((a,b) => {
      const aDate = new Date(a.Timestamp);
      const bDate = new Date(b.Timestamp);

      if (aDate > bDate) {
        return 1;
      }

      if (aDate < bDate) {
        return -1;
      }

      return 0;
    })
    console.log('[INFO] query successful');
    return makeResponse(200, result);
  } catch (error) {
    console.log('[ERROR]', error);
    return makeResponse(500, { error })
  }
}