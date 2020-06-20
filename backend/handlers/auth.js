const jwt = require('jsonwebtoken');

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY;

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId,
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports.handler = async (event) => {
  console.log('event', event);

  if (!event.authorizationToken) {
    console.log('[ERROR] Missing token');
    throw new Error('Unauthorized');
  }

  const [tokenType, tokenValue] = event.authorizationToken.split(' ');

  if (!(tokenType.toLowerCase() === 'bearer' && tokenValue)) {
    console.log('[ERROR] No bearer token');
    throw new Error('Unauthorized');
  }

  const options = {
    audience: AUTH0_CLIENT_ID,
    algorithms: ['RS256'],
  };

  try {
    const decoded = jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options);
    console.log('[INFO] decoded token', decoded);
    return generatePolicy(decoded.sub, 'Allow', event.methodArn);
  } catch (err) {
    console.log('[ERROR] Invalid token', err);
    throw new Error('Unauthorized');
  }
};