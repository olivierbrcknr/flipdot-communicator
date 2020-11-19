import React, {useEffect} from 'react';

import './VFDDot.css';

const VFDDot = (props) => {

  let classes = ["VFDDot"];

  if( props.isFlipped ){
    classes.push('--isFlipped')
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
      <div className="VFDDot-Stopper"></div>
    </div>
  )
}

export default VFDDot



