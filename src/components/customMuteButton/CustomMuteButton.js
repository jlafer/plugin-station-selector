import React from 'react';
import {
  IconButton,
  TaskHelper,
  withTheme
} from '@twilio/flex-ui';

import ConferenceService from '../../helper/ConferenceService';
import FlexWorkerState from '../../helper/FlexWorkerState';


class CustomMuteButton extends React.PureComponent {
  handleClick = async () => {
    console.debug('*** Custom Mute Button clicked');
    const { task } = this.props;
    const { conference } = task;
    const { conferenceSid } = conference;
    const token  = this.props.manager.user.token;

    const workerParticipant = FlexWorkerState.getLocalParticipantForTask(task);
    const { callSid: participantCallSid } = workerParticipant;
    
    if (workerParticipant.muted) {
      await ConferenceService.unMuteParticipant(token, conferenceSid, participantCallSid);
    } else {
      await ConferenceService.muteParticipant(token, conferenceSid, participantCallSid);
    }
  }

  render() {
    const { task, theme } = this.props;

    const workerParticipant = FlexWorkerState.getLocalParticipantForTask(task);
    const isLiveCall = TaskHelper.isLiveCall(task);

    return (
      <React.Fragment>
        <IconButton
          icon={workerParticipant.muted ? 'MuteLargeBold' : 'MuteLarge'}
          disabled={!isLiveCall}
          onClick={this.handleClick}
          themeOverride={theme.CallCanvas.Button}
          title="Mute Call"
        />
      </React.Fragment>
    )
  }
}

export default withTheme(CustomMuteButton);