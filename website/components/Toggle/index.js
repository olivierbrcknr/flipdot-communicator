import React, {useRef} from 'react';

import styles from './Toggle.module.css';

const Toggle = (props) => {

  let classes = [styles.Toggle];

  let descriptions = [];

  let options = props.options.map( (opt, k) => {

    let descRef = useRef();

    let optionClasses = [];
    if( opt.val === props.value ){
      optionClasses.push(styles.isActive);
    }

    if( !opt.isSelectable ){
      optionClasses.push(styles.isDisabled);
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
        descRef.current.classList.add(styles.isHovering);
      }else{
        descRef.current.classList.remove(styles.isHovering);
      }
    }
    let descEl = <div ref={descRef} className={styles.ToggleDescription} key={'ToggleDescKey-'+k}>
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



