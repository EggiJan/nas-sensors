const { dynamoDB } = require('../clients/db');

module.exports.handler = async (event, context) => {
  
  if (!event.queryStringParameters) {
    return {
      body: 'Missing Parameters',
      statusCode: 400,
    }
  }

  const {
    secret,
    cpu_temp: CPUTemp,
    sys_temp: SYSTemp,
    temp1_temp: Temp1Temp,
    fan1_speed: Fan1Speed,
    fan2_speed: Fan2Speed
  } = event.queryStringParameters;

  console.log('[INFO] Got data', JSON.stringify({ CPUTemp, SYSTemp, Temp1Temp, Fan1Speed, Fan2Speed }));

  if (secret !== process.env.SECRET) {
    console.log('[ERROR] Secret mismatch');
    return {
      body: 'Wrong secret',
      statusCode: 401,
    }
  }
  
  const obj = {
    Timestamp: (new Date()).toISOString(),
    CPUTemp: parseFloat(CPUTemp),
    SYSTemp: parseFloat(SYSTemp),
    Temp1Temp: parseFloat(Temp1Temp),
    Fan1Speed: parseInt(Fan1Speed),
    Fan2Speed: parseInt(Fan2Speed)
  }

  console.log('[INFO] Saving data', JSON.stringify(obj));

  try {
    await dynamoDB.put(obj);
    console.log('[INFO] data set created');
    return {
      body: JSON.stringify(obj),
      statusCode: 200,
    }
  } catch (error) {
    console.log('[ERROR]', error);
    return {
      body: error,
      statusCode: 500,
    }
  }
}