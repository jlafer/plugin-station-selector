import React from 'react';
import { FlexPlugin } from 'flex-plugin';

import { pluginMainHeaderHelper } from './helper/MainHeaderHelper';
import './helper/CustomListeners';
import './helper/FlexWorkerState';
import FlexWorkerState from './helper/FlexWorkerState';
import CustomMuteButton from './components/customMuteButton/CustomMuteButton';

const PLUGIN_NAME = 'StationSelectorPlugin';

export default class StationSelectorPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    // handle component state based on worker contact_uri
    //
    const shouldModifyMuteButton = () => {
      return !FlexWorkerState.isWorkerUsingWebRTC();
    }

    flex.CallCanvasActions.Content.remove('toggleMute',
      { if: shouldModifyMuteButton }
    );

    flex.CallCanvasActions.Content.add(
      <CustomMuteButton key="custom-mute-button" manager={manager} />,
      {
        sortOrder: -1,
        if: shouldModifyMuteButton
      }
    );

    //  load the station selector setting button
    pluginMainHeaderHelper(flex, manager);
  }
}
