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
  console.log('starting...')
  const debug = true;
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

  //  handler to update worker attributes given the config of the station selection
  async function updateWorker(workerSid, attributes, pluginConfig) {
    //  get existing plugin_preferences from attributes
    let plugin_preferences = [];
    if (attributes.hasOwnProperty('plugin_preferences')) {
      plugin_preferences = attributes.plugin_preferences;
    } else {
      console.log('plugin_preference JSON not found');
    }

    // find index within plugin preferences to update plugin with name
    let index = plugin_preferences.findIndex(
      (item) => item.name === pluginConfig.name
    );

    //  update existing preferences
    switch (index) {
      case -1:
        // plugin_preferences JSON object not found
        plugin_preferences.push(pluginConfig);
        break;
      default:
        // found at index
        plugin_preferences[index] = pluginConfig;
        break;
    }
    if(debug){console.log(plugin_preferences)};

    //  merge updated plugin_preferences into the worker attributes
    attributes = { ...attributes, plugin_preferences };


    if(index== -1 ) {index = 0}

    // update contact_uri based on selectedStation
    switch (attributes.plugin_preferences[index].config.selectedStation) {
      case 'client':
        attributes.contact_uri =
          attributes.plugin_preferences[index].config.clientAddress;
        break;
      case 'pstn':
        attributes.contact_uri =
          attributes.plugin_preferences[index].config.pstnNumber;
        break;
      case 'sip':
        attributes.contact_uri =
          'sip:' + attributes.plugin_preferences[index].config.sipAddress;
        break;
    }

    //update the worker attributes
    return await client.taskrouter
      .workspaces(context.FLEX_TR_WORKSPACE)
      .workers(workerSid)
      .update({
        attributes: JSON.stringify(attributes),
      })
      .then((worker) => {
        result = { status: 'success', data: worker };
        return result;
      })
      .catch((error) => {
        result = { status: 'error', data: error };
        console.log('error updating TR worker attributes', error);
        return result;
      });
  }

  //  capture method of library
  //  mode:  ( updateWorkerAttributes, getWorkerAttributes)
  //
  let mode = event.mode;

  switch (mode) {
    case 'updateWorkerAttributes':
      result = await updateWorker(
        event.workerSid,
        event.workerAttributes,
        event.pluginConfig
      );
      response.setBody(JSON.stringify(result));
      return callback(null, response);

      break;
  }
};
