class ConferenceService {
    static baseServerlessUrl = `${process.env.REACT_APP_SERVERLESS_DOMAIN}`
  
    static removeParticipant = async (token, conferenceSid, participantCallSid) => {
      const fetchUrl = `${this.baseServerlessUrl}/remove-conf-participant`;
      const fetchBody = {
        token,
        conferenceSid,
        participantCallSid
      };
      const fetchResponse = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(fetchBody)
      });
      let response;
      try {
        response = fetchResponse && await fetchResponse.json();
      } catch (error) {
        console.error('Unable to parse remove participant response to JSON.', error);
      }
      console.debug('*** Conference participant remove response:', response);
    }
  
    static updateParticipant = async (token, conferenceSid, participantCallSid, updateProperties) => {
      const fetchUrl = `${this.baseServerlessUrl}/update-conf-participant`;
      const fetchBody = {
        token,
        conferenceSid,
        participantCallSid,
        ...updateProperties
      };
      const fetchResponse = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(fetchBody)
      });
      let response;
      try {
        response = fetchResponse && await fetchResponse.json();
      } catch (error) {
        console.error('Unable to parse update participant response to JSON.', error);
      }
      console.debug('*** Conference participant updated:', response);
    }
  
    static muteParticipant = async (token, conferenceSid, participantCallSid) => {
      const updateProperties = {
        muted: true
      };
      await this.updateParticipant(token, conferenceSid, participantCallSid, updateProperties);
    }
  
    static unMuteParticipant = async (token, conferenceSid, participantCallSid) => {
      const updateProperties = {
        muted: false
      };
      await this.updateParticipant(token, conferenceSid, participantCallSid, updateProperties);
    }
  }
  
  export default ConferenceService;