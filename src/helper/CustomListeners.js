import * as Flex from '@twilio/flex-ui';
import FlexWorkerState from './FlexWorkerState'
import ConferenceService  from './ConferenceService'

const hangupNonWebRtcCall = async (task) => {
  const { conference } = task;
  const { conferenceSid, participants } = conference;
  const workerParticipant = participants.find(p => p.workerSid === FlexWorkerState.workerSid);
  
  const { callSid: participantCallSid } = workerParticipant;


  let token = manager.user.token;
  console.log('========= HANGUP ==========')
  console.log(token);

  await ConferenceService.removeParticipant(token, conferenceSid, participantCallSid);
};

Flex.Actions.addListener('beforeWrapupTask', async (payload, abort) => {
  if (FlexWorkerState.isWorkerUsingWebRTC()) {
    return;
  }
  const { task } = payload;
  if (!Flex.TaskHelper.isCallTask(task)) {
    return;
  }
  await hangupNonWebRtcCall(task);
  abort();
});

Flex.Actions.addListener('beforeHangupCall', async (payload, abort) => {
  if (FlexWorkerState.isWorkerUsingWebRTC()) {
    return;
  }
  const { task } = payload;
  if (!Flex.TaskHelper.isCallTask(task)) {
    return;
  }
  await hangupNonWebRtcCall(task);
  abort();
});