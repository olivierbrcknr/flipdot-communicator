import React, {useRef} from 'react';

import './Toggle.css';

const Toggle = (props) => {

  let classes = ["Toggle"];

  let descriptions = [];

  let options = props.options.map( (opt, k) => {

    let descRef = useRef();

    let optionClasses = [];
    if( opt.val === props.value ){
      optionClasses.push('--isActive');
    }

    if( !opt.isSelectable ){
      optionClasses.push('--isDisabled');
    }

    let clickFn = () => {
      if( opt.isSelectable ){
        props.callback(k)
      }else{
        console.log('sorry, does not work yet 😕')
      }
    }

    let checkHoverFn = (bool) => {
      if( bool ){
        descRef.current.classList.add('--isHovering');
      }else{
        descRef.current.classList.remove('--isHovering');
      }
    }
    let descEl = <div ref={descRef} className="Toggle-Description" key={'ToggleDescKey-'+k}>
        {opt.description}
      </div>

    descriptions.push(descEl);

    return(
      <li
        onClick={ clickFn }
        onMouseEnter={() => checkHoverFn(true)}
        onMouseLeave={() => checkHoverFn(false)}
        className={optionClasses.join(' ')}
        key={'ToggleKey-'+k}>
        {opt.val}
      </li>
    )
  } );

  return(
    <div className={classes.join(' ')}>
      <ul>
        {options}
      </ul>

      { props.displayDescriptions ? descriptions : null }

    </div>
  )
}

export default Toggle



