import React, { Component } from 'react';
import * as Flex from '@twilio/flex-ui';

import PstnAddressHelpText from './helper/PstnStationHelper';
import SipAddressHelperText from './helper/SIPStationHelper';
import OperationResultText from './helper/OperationResultText';

import 'react-phone-input-2/lib/style.css';
import PhoneNumberInput from 'react-phone-input-2';
//  Docs: https://github.com/bl00mber/react-phone-input-2

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

import { UpdateWorkerAttributes } from '../settingsbutton/helper/UpdateWorkerHelper';

class StationSelectorComponent extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      radioSelected: 'client',
      clientAddress: 'client:',
      pstnNumber: '',
      sipAddress: '',
      pstnDisabled: true,
      sipDisabled: true,
      expanded: true,
      messageStatus: { display: false, status: '' },
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.btnSaveUpdate = this.btnSaveUpdate.bind(this);
    this.setStationSelectorState = this.setStationSelectorState.bind(this);
  }

  init() {}

  // retrieve plugin_preferences JSON from worker attributes
  getPreferences(attr) {
    let temp = [];
    if (attr.hasOwnProperty('plugin_preferences')) {
      temp = attr.plugin_preferences;
    }
    return temp;
  }

  // method to set local component state for config of the station selector
  setStationSelectorState(stationConfig) {
    this.setState({ radioSelected: stationConfig.config.selectedStation });
    this.setState({ clientAddress: stationConfig.config.clientAddress });
    this.setState({ sipAddress: stationConfig.config.sipAddress });
    this.setState({ pstnNumber: stationConfig.config.pstnNumber });

    switch (stationConfig.config.selectedStation) {
      case 'client':
        this.setState({ radioSelected: 'client' });
        this.setState({ pstnDisabled: true });
        this.setState({ sipDisabled: true });
        break;
      case 'sip':
        this.setState({ radioSelected: 'sip' });
        this.setState({ pstnDisabled: true });
        this.setState({ sipDisabled: false });
        break;
      case 'pstn':
        this.setState({ radioSelected: 'pstn' });
        this.setState({ pstnDisabled: false });
        this.setState({ sipDisabled: true });
        break;
    }
    this.setState({ expanded: true });
  }

  // initialize component state based on worker attributes
  componentDidMount(_props) {
    // get current worker attributes
    let pluginPreferences = this.getPreferences(
      this.props.manager.workerClient.attributes
    );

    let defaultStationConfig = {
      name: 'stationSelector',
      config: {
        selectedStation: 'client',
        clientAddress: 'client:' + this.props.manager.workerClient.name,
        pstnNumber: '+13035551212',
        sipAddress: '1234@sipdomain.com',
      },
    };

    // pluginPreferences check -
    if (pluginPreferences.length == 0) {
      // initialize component state w/ defaults
      this.setStationSelectorState(defaultStationConfig);
    // update worker properties
    } else {
      // find array index for plugin config props
      const index = pluginPreferences.findIndex(
        (item) => item.name === defaultStationConfig.name
      );
      switch (index) {
        case -1:
          // stationSelector config does not exist
          pluginPreferences.push(defaultStationConfig);
          break;
        default:
          let currentStationConfig = {
            name: 'stationSelector',
            config: {
              selectedStation:
                this.props.manager.workerClient.attributes.plugin_preferences[
                  index
                ].config.selectedStation,
              clientAddress: 'client:' + this.props.manager.workerClient.name,
              pstnNumber:
                this.props.manager.workerClient.attributes.plugin_preferences[
                  index
                ].config.pstnNumber,
              sipAddress:
                this.props.manager.workerClient.attributes.plugin_preferences[
                  index
                ].config.sipAddress,
            },
          };
          this.setStationSelectorState(currentStationConfig);
          break;
      }
    }
  }

  //  toggle display of the right sidebar drawer
  toggleDrawer() {
    this.setState({ showMenu: false });
  }

  //  handle changes to the radio options
  //  include management of the text fields to disable entry
  handleRadioChange(event) {
    event.preventDefault();
    this.setState({ radioSelected: event.target.id });
    switch (event.target.id) {
      case 'client':
        this.setState({ pstnDisabled: true });
        this.setState({ sipDisabled: true });
        break;
      case 'pstn':
        this.setState({ pstnDisabled: false });
        this.setState({ sipDisabled: true });
        break;
      case 'sip':
        this.setState({ pstnDisabled: true });
        this.setState({ sipDisabled: false });
        break;
    }
    this.setState({ radioSelected: event.target.value });
  }

  //  handle change for expansion panel
  handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      this.setState({ expanded: panel });
    } else {
      this.setState({ expanded: false });
    }
  };

  //  handle change to capture the PSTN number
  handlePstnChange = (e) => {
    this.setState({ pstnNumber: e.target.value });
  };

  //  handle change to capture SIP address
  handleSipChange = (e) => {
    this.setState({ sipAddress: e.target.value });
  };

  //  handler to manage updates to station settings
  async btnSaveUpdate() {
    const manager = Flex.Manager.getInstance();
    let workerSid = manager.workerClient.sid;
    let workerAttributes = manager.workerClient.attributes;
    let pluginConfig = {
      name: 'stationSelector',
      config: {
        selectedStation: this.state.radioSelected,
        clientAddress: this.state.clientAddress,
        pstnNumber: '+' + this.state.pstnNumber,
        sipAddress: this.state.sipAddress,
      },
    };

    let result = await UpdateWorkerAttributes(
      this.props.manager.user.token,
      workerSid,
      workerAttributes,
      pluginConfig
    );
    //   proocess the result message text
    let temp = JSON.parse(result);
    if (temp.status == 'success') {
      this.setState({ messageStatus: { display: true, status: 'success' } });
    } else {
      this.setState({ messageStatus: { display: true, status: 'error' } });
    }
  }

  render() {
    let manager = Flex.Manager.getInstance();
    let clientName = manager.workerClient.name;
    let layout = (
      <div>
        <p style={styles.txtSmall}>
          Select and configure your Flex Voice Endpoint.
        </p>
        <p>&nbsp;</p>
        <p style={styles.title_12}>Choose Option:</p>
        <FormControl component='fieldset'>
          <RadioGroup
            row
            aria-label='position'
            name='position'
            // defaultValue='client'
            value={this.state.radioSelected}
            onChange={this.handleRadioChange}
          >
            <FormControlLabel
              value='client'
              control={<Radio color='primary' inputProps={{ id: 'client' }} />}
              label='webRTC'
            />{' '}
            <FormControlLabel
              value='pstn'
              control={<Radio color='primary' inputProps={{ id: 'pstn' }} />}
              label='PSTN'
            />
            <FormControlLabel
              value='sip'
              control={<Radio color='primary' inputProps={{ id: 'sip' }} />}
              label='SIP'
            />
          </RadioGroup>
        </FormControl>
        <p>&nbsp;</p>
        <Divider />
        <p>&nbsp;</p>
        <p style={styles.title_12}>Option Settings</p>
        <p>&nbsp;</p>
        <Grid container spacing={8}>
          <Grid item xs={3}>
            <p style={styles.txtSmall}>webRTC:</p>
          </Grid>
          <Grid item xs={9}>
            <p style={styles.txtSmall}>{`client:${clientName}`}</p>
          </Grid>
          <Grid item xs={12}>
            &nbsp;
          </Grid>

          <Grid item xs={3}>
            <p style={styles.txtSmall}>PSTN:</p>
          </Grid>
          <Grid item xs={9}>
            <PhoneNumberInput
              country={'us'}
              value={this.state.pstnNumber}
              onChange={(pstnNumber) => this.setState({ pstnNumber })}
              disabled={this.state.pstnDisabled}
              preferredCountries={['us', 'ca']}
              inputStyle={styles.phoneStyle}
            />
            <PstnAddressHelpText />
          </Grid>

          <Grid item xs={3}>
            <p style={styles.txtSmall}>SIP:</p>
          </Grid>
          <Grid item xs={9}>
            <input
              id='sip'
              type='text'
              style={styles.sipAddress}
              disabled={this.state.sipDisabled}
              onChange={this.handleSipChange}
              value={this.state.sipAddress}
            />
            <SipAddressHelperText />
          </Grid>

          <Grid item xs={12}>
            {' '}
            <Button
              style={styles.stationSaveButton}
              variant='contained'
              size='small'
              color='primary'
              onClick={this.btnSaveUpdate}
            >
              Save/Update
            </Button>
          </Grid>
          <Grid item xs={12}>
            <OperationResultText statusMessage={this.state.messageStatus} />
          </Grid>
        </Grid>
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
  title_12: { fontSize: '12px', fontWeight: 'bold' },
  title_10: { fontSize: '10px', fontWeight: 'bold' },
  txtSmall: { fontSize: '12px' },
  sipAddress: {
    maxHeight: '30px',
    width: '200px',
    border: '1px solid #CACACA',
    padding: '10px',
  },
  phoneStyle: {
    width: '225px',
  },

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
  headerCategory: {
    float: 'right',
    fontSize: '12pt',
    marginRight: '20px',
  },
  stationSaveButton: {
    width: '100%',
  },
};

export default StationSelectorComponent;
