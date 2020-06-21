# NAS Sensors
WebApp to report and graph my home server's temperatures and fan speeds.

Made with AWS Lambda, React, [recharts](https://recharts.org) and [Auth0](http://auth0.com/). 

## Backend
* Provides two endpoints to read and write data
* Data is stored in DynamoDB
* Authentication is handled by Auth0 and a custom authorizer function

### GET /store
Data is gathered using a cronjob and `lm-sensors` on debian. See `submitTemp.sh`.

Allowed parameters:

|Parameter|Description|
|-----|----|
|secret|**required** String - must match the secret of the backend|
|cpu_temp|_optional_ Float|
|sys_temp|_optional_ Float|
|temp1_temp|_optional_ Float|
|fan1_speed|_optional_ Number|
|fan2_speed|_optional_ Number|


### GET /fetch
Allows fetching of data from a given time range.

Allowed parameters:

|Parameter|Description|
|-----|----|
|from|_optional_ Timestamp in ms|
|to|_optional_ Timestamp in ms|


## Build & Deploy

```
cd client
npm i
npm run build

cd backend
npm i
serverless deploy
serverless client deploy
```