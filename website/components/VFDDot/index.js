import React, {useEffect} from 'react';

import styles from './VFDDot.module.css';

const VFDDot = (props) => {

  let classes = [styles.VFDDot];

  if( props.isFlipped ){
    classes.push(styles.isFlipped)
  }

  const size = props.size ? props.size : 20;

  let style = {
    left: props.x * size + 'px',
    top: props.y * size + 'px',
    width: size + 'px',
    height: size + 'px'
  };

  return(
    <div className={classes.join(' ')} style={style} key={props.passKey}>
      <div className={styles.VFDDotStopper}></div>
    </div>
  )
}

export default VFDDot



