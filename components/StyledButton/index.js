import React from 'react';

import './StyledButton.css';

const StyledButton = (props) => {

  let classes = ["StyledButton"];

  return(
    <div className={classes.join(' ')}>
      {props.children}
    </div>
  )
}

export default StyledButton



