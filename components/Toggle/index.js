import React from 'react';

import './Toggle.css';

const Toggle = (props) => {

  let classes = ["Toggle"];

  let options = props.options.map( (opt, k) => {

    let optionClasses = [];
    if( opt === props.value ){
      optionClasses.push('--isActive');
    }

    return(
      <li
        onClick={ () => {props.callback(opt)} }
        className={optionClasses.join(' ')}
        key={'ToggleKey-'+k}>
        {opt}
      </li>
    )
  } );

  return(
    <div className={classes.join(' ')}>
      <ul>
        {options}
      </ul>
    </div>
  )
}

export default Toggle



