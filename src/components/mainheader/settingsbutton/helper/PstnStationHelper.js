import React from 'react';

export default function PstnAddressHelpText() {
  return (
    <div>
      <p style={styles.helperText}>Enter a PSTN phone number</p>
    </div>
  );
}

const styles = {
  helperText: {
    // marginLeft: '50px',
    fontSize: '8pt',
    color: '#d9dce4',
  },
};
