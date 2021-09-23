import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';

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
    window.flex = flex;
    window.manager = manager;

    this.registerReducers(manager);


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

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
