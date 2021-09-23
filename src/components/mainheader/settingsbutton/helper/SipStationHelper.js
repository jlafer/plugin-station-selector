import React from 'react';

export default function SipAddressHelperText() {
  return (
    <div>
      <p style={styles.helperText}>Enter a SIP address</p>
      <p style={styles.helperText}>(e.g. sip:12345@demo.sip.twilio.com)</p>
    </div>
  );
}

const styles = {
  helperText: {
    // marginLeft: '50px',
    fontSize: '8pt',
    color: '#d9dce4',
    padding: '5px',
  },
};
