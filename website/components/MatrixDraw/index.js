import React, {useState, useEffect} from 'react';

import styles from './MatrixDraw.module.css';
import StyledButton from '../StyledButton'

const columns = 10;
const rows = 7;

const MatrixDraw = (props) => {

  const [matrixState,setMatrixState] = useState( new Array(columns*rows).fill(false) );
  const [isUpdated,setIsUpdated] = useState(false);

  let classes = [styles.MatrixDraw];

  useEffect( ()=>{
    setIsUpdated(false);
  }, [matrixState,isUpdated])

  let togglePixel = (i) => {
    let dummyMatrix = matrixState;
    dummyMatrix[i] = !dummyMatrix[i];
    setMatrixState(dummyMatrix);
    setIsUpdated(true);
  }

  let pixels = matrixState.map( (px, k) => {

    let pxClasses = [styles.MatrixDrawPixel];

    if( px ){
      pxClasses.push(styles.MatrixDrawPixelIsOn);
    }

    return (
      <div
        className={pxClasses.join(' ')}
        key={'Pixel-'+k}
        onClick={ () => { togglePixel(k) } }>

      </div>
    )
  });

  return(
    <div className={classes.join(' ')}>

      <div className={styles.MatrixDrawContainer}>
        {pixels}
      </div>

      <StyledButton onClick={ () => {
        props.callback(matrixState);
        setMatrixState( new Array(columns*rows).fill(false) );
      } }>
        Send
      </StyledButton>
    </div>
  )
}

export default MatrixDraw



