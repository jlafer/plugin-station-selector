import * as Flex from '@twilio/flex-ui';

class FlexWorkerState {
  static get manager() {
    return Flex.Manager.getInstance();
  }

  static get workerClient() {
    return this.manager.workerClient;
  }

  static get workerSid() {
    return this.workerClient.sid;
  }

  static isWorkerUsingWebRTC = () => {
    const { attributes } = this.workerClient;
    const { contact_uri } = attributes;
    return contact_uri.startsWith('client:');
  }

  static getLocalParticipantForTask = (task) => {
    const { conference } = task;
    const { participants } = conference;
    const workerParticipant = participants.find(p => p.workerSid === this.workerSid);

    return workerParticipant
  }
}

export default FlexWorkerState;