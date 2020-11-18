import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';

import VFDDot from '../VFDDot'
import { startupAnimation, sweepAnimation } from './matrixAnimations.js'

import './VirtualFlipDot.css';

// source https://freesound.org/people/joedeshon/sounds/119415/
import flipSoundFile from './flip.mp3'

const columns = 10;
const rows = 7;

const VirtualFlipDot = (props) => {

  const [vfdState, setVfdState] = useState({
    message: {
      type: 'StartUp',
      content: false,
    },
    matrix: new Array(columns*rows).fill(false),
    isAnimating: false,
    queue: []
  });

  useEffect(()=>{
    if( props.comState.isNewMessage ){
      setVfdState({
        ...vfdState,
        message: props.comState.message
      });
    }
  },[props.comState])

  useEffect(()=>{
    console.log('new message')
    playAnimation( vfdState.message.type, vfdState.message.content );
  },[vfdState.message])

  let classes = ["VirtualFlipDot"];

  const dotSize = 30;

  const [flipSound] = useSound(
    flipSoundFile,
    { volume: 0.25 }
  );

  let buttonClick = () => {
    console.log('button clicked');
  }

  // callback function for animations
  let setMatrix = ( mtrx , isDone ) => {
    let newMatrix = vfdState.matrix;
    let isAnimating = true;
    if( mtrx ){
      newMatrix = mtrx;
      flipSound();
    }
    if( isDone ){
      isAnimating = false;
    }
    setVfdState({
      ...vfdState,
      matrix: newMatrix,
      isAnimating: isAnimating
    });
  }

  let playAnimation = ( type, msg ) => {
    if( !vfdState.isAnimating ){
      let animationStarting = false;
      switch( type ){
        case 'hello':
          sweepAnimation(setMatrix);
          animationStarting = true;
          break;
      }
    }
  }

  let dots = [];
  for ( let y = 0; y < rows; y++ ){
    for( let x = 0; x < columns; x++ ){

      let i = x + y*columns;
      let isFlipped = vfdState.matrix[i];
      let dot = <VFDDot
        size={dotSize}
        key={'FlipDot-'+x+'-'+y}
        passKey={'FlipDot-'+x+'-'+y}
        x={x}
        y={y}
        isFlipped={isFlipped} />
      dots.push(dot);
    }
  }

  let styleRegPadding = dotSize/3;

  let styleCase = {
    width: dotSize*10 + styleRegPadding*2 +'px',
    height: dotSize*7 + styleRegPadding*2 + dotSize*3 + 'px',
    padding: styleRegPadding + 'px'
  }

  let styleButton = {
    width: dotSize + 'px',
    height: dotSize + 'px',
    right: dotSize + styleRegPadding + 'px',
    bottom: dotSize + styleRegPadding + 'px'
  }

  return(
    <div className={classes.join(' ')} style={styleCase}>

      <div className="VirtualFlipDot-Matrix">
        {dots}
      </div>

      <div
        onClick={ () => buttonClick() }
        className="VirtualFlipDot-Button"
        style={styleButton}>

      </div>

      <div className="VirtualFlipDot-Cable">

      </div>

    </div>
  )
}

export default VirtualFlipDot



