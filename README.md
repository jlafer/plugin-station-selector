# Flex Station Selector

Enable and empower agent voice connectivity in a simple selection between native webRTC, PSTN and/or SIP endpoints.

This Flex Plugin provides configurable support to update the agent's (worker) 'contact_uri' attributes while retaining perferences on current and past settings.

&nbsp;

## Architecture

This is the typical architecture that reflects the communications between the Flex UI (plugin) and the Twilio Cloud (Serverless Functions).

&nbsp;

![Typical Twilio Architecture](/docs/images/architecture_600.jpg)  
&nbsp;

Proper operation of this Flex plugin results in a new JSON array ('plugin_preferences') that is concatenated to the Flex Taskrouter Worker attribute string.

Here is the syntax of the JSON array object:

```
{
  "full_name": "Firstname Lastname",
  "public_identity": "Agent X Rocks",
  "image_url": "https://www.gravatar.com/avatar/ebc716d59701abed6a946bb997abf80d?d=mp",
  "email": "agent@twilio.com",
  "roles": [
    "admin"
  ],
  "contact_uri": "client:flastname",
  "twilio_contact_identity": "flastname",
  "plugin_preferences": [
    {
      "name": "stationSelector",
      "config": {
        "selectedStation": "client",
        "clientAddress": "+13035551212",
        "pstnNumber": "+13035551212",
        "sipAddress": "1234@sipdomain.com"
      }
    }
  ]
}
```

&nbsp;
**Note**: The actual worker attribute object may differ from the above given your own usage. Setting of the worker's 'contact_uri' attribute value is the '**Twilio Magic**' of this plugin.  
&nbsp;

## Screenshots

Here is the screenshot of the Flex plugin extension to enable configuration of the agent's station selection.

![Station Selector Screenshot](/docs/images/stationSelector.jpg)
&nbsp;

## Prerequisites

- Twilio CLI (command line interface) : [CLI Quickstart Guide](https://www.twilio.com/docs/twilio-cli/quickstart)
- Twilio Serverless & Flex Plugin : [CLI Plugins](https://www.twilio.com/docs/twilio-cli/plugins)

- Code editor of choice ( e.g. Visual Studio Code)

&nbsp;

## Deployment Time

Deployment of this plugin is quick and easy and embodies the following phases:

- Download
- Configure your environment ( plugin (.env), public (appConfig.js) and serverless .env)
- Build the plugin dependencies ( plugin and serverless )
- Test Locally (optional)
- Deploy and Publish

Dependent upon your knowledge of Twilio, the time to deploy could be 30-40 minutes.

&nbsp;

## Tested Flex Versions and Operating Systems

- Flex UI v1.x.x
- macOS / Unix
- Windows 10

&nbsp;

## Configure/Test/Deploy

Perform the following steps to configure, test and deploy this Twilio Flex plugin and supporting Twilio Functions.  
&nbsp;

### Step 1 : Install Twilio CLI (command line interface)

1. Install CLI using the official [Twilio CLI Quickstart](https://www.twilio.com/docs/twilio-cli/quickstart)
2. Install the CLI plugins for serverless and Flex [CLI Plugins](https://www.twilio.com/docs/twilio-cli/plugins)
3. Create a [CLI profile](https://www.twilio.com/docs/twilio-cli/general-usage))

```
twilio profiles:create
```

4. Set CLI active profile

```
twilio profiles:use <ProfileName>
```

&nbsp;

### Step 2: Download the plugin code

Download the Flex Station Selector plugin code and unzip the package.  
&nbsp;

### Step 3: Configure environment files

1. Open a terminal (command editor) window in the root of the plugin folder, make a copy of the '.example.env' file with the filename as '.env'

```
cp .example.env .env
```

Configure the environment variable ('REACT_APP_SERVERLESS_DOMAIN') with the https location of your [ngrok](https://ngrok.io) tunnel during localhost development and testing.

Here is the Twilio CLI syntax for instantiation of local Twilio Function development/testing:

```
twilio serverless:start --ngrok=<NgrokTunnelName>
```

Alternatively, configure this variable with the Twilio URI of the function runtime realized after the serverless deployment phase (below).  
&nbsp;

2. Using a terminal session, make a copy of the .example.env' file located in the 'stationselector-serverless' folder and name it '.env'.

```
cd stationselector-serverless
cp .example.env .env
```

Configure the environment variables for your Twilio Account SID, Auth Token and Taskrouter Flex Workspace SID.  
&nbsp;

3. Using the code editor, configure the 'appConfig.js' file located in the 'public' folder for your Twilio Account SID.  
   &nbsp;

### Step 3: Build plugin and serverless function dependencies

1. Using the code editor of your choice ( e.g. Visual Studio Code ), open the plugin project.
   Open a terminal editor in the root of the plugin and build the plugin dependencies.

```
npm install
```

2. In the teminal editor, change path to the folder 'stationselector-serverless'. Build the necessary dependencies.

```
cd stationselector-serverless
npm install
```

&nbsp;

## Local Plugin Testing (optional)

This section outlines the steps for local testing of this Flex plugin and supporting serverless functions. This process involves the following steps:

1. Log into the Twilio Console for your Flex project;
2. Start localhost instance of Twilio serverless functions;
3. Verify plugin '.env' 'REACT_APP_SERVERLESS_DOMAIN' setting;
4. Launch local instance of Flex plugin

&nbsp;

Step 1: Log on to Twilio  
Access your [Twilio Console](https://www.twiliio.com/console) and navigate to your Flex Project.

Step 2: Launch Serverless Environment
Use this Twilio CLI command syntax to launch a localhost instance of the supporting Twilio serverless functions.

```
twilio serverless:start --ngrok=<NgrokTunnelName>
```

**NOTE:** The ngrok 'NgrokTunnelName' is key for configuration of the plugin '.env' environment variable ('REACT_APP_SERVERLESS_DOMAIN').

&nbsp;

Step 3: Plugin '.env' Configuration  
Verify that the value of 'REACT_APP_SERVERLESS_DOMAIN' in this file is set correctly.

```
REACT_APP_SERVERLESS_DOMAIN=https://<NgrokTunnelName>.ngrok.io
```

&nbsp;
Step 4: Launch Flex Plugin Locally
Use the following CLI command to launch the Flex user interface (UI).

```
twilio flex:plugins:start
```

&nbsp;
Step 5: Conduct testing on the the plugin behavior.

&nbsp;

## Deploy the Flex Plugin and Serverless Functions

This section itemizes the steps necessary to deploy the serverless functions and Flex plugin. These steps are:

- Deploy the Twilio Functions
- Capture the Serverless Runtime URI
- Update the Serverless 'Service' to allow 'edits' within the console (optional)
- Update the Flex '.env' configuration for the 'REACT_APP_SERVERLESS_DOMAIN' variable
- Deploy and publish the Flex Plugin

&nbsp;

Step 1: Deploy the Twilio Functions
Using the Twilio CLI, open a terminal window within the 'stationselector-serverless' folder and execute the following command.

```
twilio serverless:deploy
```

Step 2: Capture Runtime URI and update plugin '.env' file configuration ('REACT_APP_SERVERLESS_DOMAIN')  
The image below highlights the output of the serverless 'deploy' command (above).  
&nbsp;

![Serverless deployment output](/docs/images/serverlessDeploy.jpg)

Step 3: Update Serverless 'Service' (Optional)
Use the Twilio CLI to update the serverless 'service' to allow edits from within the Twilio console

```
twilio api:serverless:v1:services:update --ui-editable --sid=<'ZS...YOUR SERVICE SID'>
```

&nbsp;

Step 4: Deploy Flex Plugin [Documentation](https://www.twilio.com/docs/flex/developer/plugins/cli/deploy-and-release)
Using a terminal within the plugin root, execute the following Twilio CLI command to deploy the Flex plugin.

Major Plugin Release Deployment

```
twilio flex:plugins:deploy --major --changelog "Initial Deployment" --description "First Station Selector initial deployment"
```

Minor Plugin Release

```
twilio flex:plugins:deploy --minor --changelog "<Enter change log description>" --description "<Enter Decription of  Update>"
```

&nbsp;

Step 5: Publish the Flex Plugin [Documentation](https://www.twilio.com/docs/flex/developer/plugins/cli/deploy-and-release)
Execute the following CLI command to publish the Flex plugin:

```
twilio flex:plugins:release --name "Flex Station Selector Initial Release" --description "Station Selector plugin initial release" --plugin plugin-station-selector@1.0.0

```

**NOTE**: Plugin updates (deployments) can be directly published via the Twilio Adminstrative UI as well.
