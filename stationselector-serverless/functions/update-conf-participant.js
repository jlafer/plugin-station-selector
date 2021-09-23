//
//  Name: SecureWorkerAttributes.js
//
//  Synopsis:  This function provides a secure HTTP POST method that validates FLEX token presentation.
//    1. It validates the Flex user JWT (token) using the IAM API
//    2. Invalid token submissions are rejected ( status: 403 )
//    3. CORS Options messages are processed successfully ( empty POST params )
//    4. Missing token submissions are rejected ( status: 403 )
//    5. HTTP GET requests are returned empty (status: 200 )
//
//    This function is responsible for updating worker attributes and merging updates into the worker attributes JSON

const nodeFetch = require('node-fetch');
const { Base64 } = require('js-base64');

//  for DEGUGGING: function to log context and event data elements
async function getContextEventElements(context, event) {
  console.log('Context Properties');
  console.log(context);
  console.log('------- debug line break ------');
  console.log('Event properties:');
  Object.keys(event).forEach((key) => {
    console.log(`${key}: ${event[key]}`);
    console.log(' ');
  });
}

//  function to validate IAM token
//  return  { isValid: true/false, data: tokenResponse }
//
async function validateToken(context, response, token) {
  //    validate Token
  let authResult = {};
  //token = '1234';

  //  Validate the Token using IAM API
  const tokenValidationApi = `https://iam.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Tokens/validate`;
  const fetchResponse = await nodeFetch(tokenValidationApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Base64.encode(
        `${context.ACCOUNT_SID}:${context.AUTH_TOKEN}`
      )}`,
    },
    body: JSON.stringify({
      token,
    }),
  });
  //
  // format the response as JSON
  let tokenResponse = await fetchResponse.json();
  // REJECT request if validation fails (false)
  if (!tokenResponse.valid) {
    authResult = {
      isValid: false,
      message: 'Invalid Token',
      data: tokenResponse,
    };
  } else {
    authResult = { isValid: true, message: 'Valid Token', data: tokenResponse };
  }
  return authResult;
}

//    HTTP GET, Empty Params, CORS Management - Responses
async function errorResponses(event) {
  let errorResult = { status: '', message: '' };
  //  CORS OPTIONS handling
  if (Object.keys(event).length === 0) {
    //  define error JSON for empty event object
    errorResult = {
      status: 'empty',
      message: 'Empty event object, likely an OPTIONS or GET request',
    };
    return errorResult;
  }

  //  no token provided
  if (!event.token) {
    errorResult = {
      status: 'no_token',
      message: 'No token provided',
    };
    return errorResult;
  }
  //  valid token and event - not OPTIONS
  return errorResult;
}

//  **************************
//  BEGIN main function block
//  **************************
exports.handler = async function (context, event, callback) {
  const debug = false;
  let authResult = {};
  let result = {};
  let errorResponse = { status: '' };

  //  CORS Response headers ( OPTIONS )
  let response = new Twilio.Response();
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  response.setHeaders(headers);

  //  DEBUG: echo the event object
  if (debug) await getContextEventElements(context, event);

  //    process GET, empty events and CORS
  errorResponse = await errorResponses(event);
  switch (errorResponse.status) {
    case 'empty':
      response.setBody(errorResponse);
      return callback(null, response);
      break;
    case 'no_token':
      response.setBody(errorResponse);
      response.setStatusCode(403);
      return callback(null, response);
      break;
    default:
      break;
  }

  //  validate the supplied token
  authResult = await validateToken(context, response, event.token);
  if (!authResult.isValid) {
    response.setStatusCode(403);
    response.setBody(authResult);
    return callback(null, response);
  }

  //  ==============================================
  //  SUCCESS: VALID FLEX TOKEN - BEGIN MAIN CODE
  //  ==============================================
  //
  if (debug) console.log('===========success============');
  const client = context.getTwilioClient();
  // response.setBody(authResult);

  const {
    conferenceSid,
    participantCallSid,
    muted
  } = event;

  console.log(`Updating participant ${participantCallSid} in conference ${conferenceSid}`);
  await client.conferences(conferenceSid)
    .participants(participantCallSid)
    .update({
      muted
    });
  console.log('Participant updated');

  const responseBody = {
    success: true
  };
  response.setBody(responseBody);

  callback(null, response);
}