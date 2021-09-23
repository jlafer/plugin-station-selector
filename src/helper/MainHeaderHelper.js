//
//  helper file to simplify the main plugin code
//
import React from 'react';

import MainHeaderSettingsButton from '../components/mainheader/MainHeaderSettingsButton';

export async function pluginMainHeaderHelper(flex, manager) {
  //  add elements to the Flex Main Header Component

  flex.MainHeader.Content.add(
    <MainHeaderSettingsButton key='header-button-two' manager={manager} />,
    {
      sortOrder: 2,
      align: 'end',
    }
  );
}
