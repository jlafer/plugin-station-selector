import React from 'react';

//
//    functional handler to manage display of success/error helper text for the AJAX settings update
export default function OperationResultText(props) {
  let message = '';
  if(props.statusMessage.display){
    if(props.statusMessage.status=='success'){
      return (<div><p style={styles.successText}>Settings successfully saved</p></div>);
    }
    if(props.statusMessage.status=='error'){
      return(<div><p style={styles.errorText}>An error has occurred...please try again</p></div>)
    }        
  }
  return ( message )
}

const styles = {
  successText: {
    // marginLeft: '50px',
    fontSize: '8pt',
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    // marginLeft: '50px',
    fontSize: '8pt',
    color: 'red',
    textAlign: 'center',
  },  
};
