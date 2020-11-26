import React from 'react';

import styles from './StyledButton.module.css';

const StyledButton = (props) => {

  let classes = [styles.StyledButton];

  return(
    <div className={classes.join(' ')} onClick={props.onClick}>
      {props.children}
    </div>
  )
}

export default StyledButton



