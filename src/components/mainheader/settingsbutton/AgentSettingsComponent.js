import React, { Component } from 'react';
import { VERSION } from '@twilio/flex-ui';
import * as Flex from '@twilio/flex-ui';

import SettingsIcon from '@material-ui/icons/Settings';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import StationSelectorComponent from './StationSelectorComponent';

class AgentSettingsComponent extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      expanded: 'panel1',
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  init() {}

  //  toggle display of the right sidebar drawer
  toggleDrawer() {
    this.setState({ showMenu: false });
  }

  handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      this.setState({ expanded: panel });
    } else {
      this.setState({ expanded: false });
    }
  };

  render() {
    let manager = Flex.Manager.getInstance();
    let clientName = manager.workerClient.name;
    let layout = (
      <div style={styles.wrapper}>
        <div style={styles.content}>
          <h4 style={styles.header_14}>Flex Agent Settings</h4>
          <SettingsIcon style={styles.headerIcon} />
          <div style={styles.headerClear}></div>
          <p>&nbsp;</p>
          <p style={styles.txtSmall}>
            Select and configure your Flex agent settings.
          </p>
          <p>&nbsp;</p>

          <ExpansionPanel
            style={styles.panel}
            expanded={this.state.expanded === 'panel1'}
            onChange={this.handleChange('panel1')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1bh-content'
              id='panel1bh-header'
            >
              <div style={styles.headerWrapper}>
                <h4 style={styles.headerTitle}>Flex Station Selector</h4>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <StationSelectorComponent manager={this.props.manager} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    );

    return layout;
  }
}

//  define component CSS styles
const styles = {
  wrapper: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    width: '350px',
  },
  content: { width: '100%' },

  header_14: { float: 'left', fontSize: '12=4px', fontWeight: 'bold' },
  headerIcon: { float: 'right' },
  headerClear: { clear: 'both' },

  panel: {
    marginBottom: '7px',
  },
  panelDetails: {
    width: '100%',
  },
  headerTitle: {
    fontSize: '10pt',
    float: 'left',
  },
};

export default AgentSettingsComponent;
