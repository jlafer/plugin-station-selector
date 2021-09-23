export async function UpdateWorkerAttributes(
  token,
  workerSid,
  workerAttributes,
  pluginConfig
) {
  async function updateWorkerAttributes(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  const { REACT_APP_SERVERLESS_DOMAIN } = process.env;

  return await updateWorkerAttributes(
    `${REACT_APP_SERVERLESS_DOMAIN}/utilWorkerUtils`,
    {
      mode: 'updateWorkerAttributes',
      token: token,
      workerSid: workerSid,
      workerAttributes: workerAttributes,
      pluginConfig: pluginConfig,
    }
  )
    .then((data) => {
      console.log('==== updateWorkerAttributes web service success ====');
      return data;
    })
    .catch((error) => {
      console.log('updateWorkerAttributes web service error', error);
    });
}

export function GetWorkerAttributes(manager, workerSid, transcriptSid) {
  async function fetchWorkerAttributes(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }
  return fetchWorkerAttributes(`${REACT_APP_SERVERLESS_DOMAIN}/utilWorkerUtils`, {
    mode: 'getWorkerAttributes',
    token: manager.user.token,
    workerSid: workerSid,
  })
    .then((data) => {
      console.log('==== fetchWorkerAttributes web service success ====');
      return data;
    })
    .catch((error) => {
      console.log('fetchWorkerAttributes web service error', error);
    });
}
