import React, { Component } from 'react';
import { VERSION } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';

import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import Drawer from '@material-ui/core/Drawer';
import AgentSettingsComponent from './settingsbutton/AgentSettingsComponent';

class MainHeaderMenuButton extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      showMenu: false,
      width: '750px',
    };
    this.handleClick = this.handleClick.bind(this);
    // this.handleClose = this.handleClose.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  init() {}

  componentWillMount(props) {}

  //  handler to show the contact directory
  handleClick = (event) => {
    console.log(event.currentTarget);
    //   this.setState({ anchorEl: event.currentTarget });
    this.setState({ showMenu: true });
  };

  //  handler to close the contact directory
  //   handleClose() {
  //     //this.setState({ showMenu: false });
  //     //this.props.showContactDirectory(false);
  //     this.setState({ anchorEl: null });
  //   }

  toggleDrawer() {
    this.setState({ showMenu: false });
  }

  render() {
    let layout = (
      <div>
        <IconButton
          style={styles.button}
          aria-label='transfer'
          onClick={this.handleClick}
        >
          <SettingsIcon />
        </IconButton>

        <Drawer
          anchor={'right'}
          open={this.state.showMenu}
          onClose={this.toggleDrawer}
          width='auto'
        >
          <AgentSettingsComponent manager={this.props.manager} />
        </Drawer>
      </div>
    );

    return layout;
  }
}

const styles = {
  wrapper: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  content: { width: '100%' },
  title: { fontSize: '12pt', fontWeight: 'bold' },
  txtSmall: { fontSize: '10pt' },

  transferButton: { marginTop: 10, marginRight: 10 },
  button: { color: 'white' },
};

export default MainHeaderMenuButton;
