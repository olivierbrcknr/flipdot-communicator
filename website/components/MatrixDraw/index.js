import React, {useState, useEffect} from 'react';

import styles from './MatrixDraw.module.css';
import StyledButton from '../StyledButton'

const columns = 10;
const rows = 7;

const MatrixDraw = (props) => {

  const [matrixState,setMatrixState] = useState( new Array(columns*rows).fill(false) );
  const [isUpdated,setIsUpdated] = useState(false);
  const [mouseIsDown,setMouseIsDown] = useState(false);
  const [currentColor,setCurrentColor] = useState(true);

  let classes = [styles.MatrixDraw];

  useEffect( ()=>{
    setIsUpdated(false);
  }, [matrixState,isUpdated])

  let togglePixel = (i, isColor) => {
    let dummyMatrix = matrixState;
    if( isColor ){
      dummyMatrix[i] = currentColor;
    }else{
      dummyMatrix[i] = !dummyMatrix[i];
    }
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
        onMouseDown={ () => {
          togglePixel(k)
          setCurrentColor( !px )
        } }
        onMouseEnter={ () => {
          if( mouseIsDown ){
            togglePixel(k, true);
          }
        } }>
      </div>
    )
  });

  return(
    <div className={classes.join(' ')}>

      <div
        className={styles.MatrixDrawContainer}
        onMouseDown={ () => { setMouseIsDown(true) } }
        onMouseUp={ () => { setMouseIsDown(false) } }
        onMouseLeave={ () => { setMouseIsDown(false) } }>
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



