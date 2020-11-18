import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';

import VFDDot from '../VFDDot'

import './VirtualFlipDot.css';

// source https://freesound.org/people/joedeshon/sounds/119415/
import flipSoundFile from './flip.mp3'

const VirtualFlipDot = (props) => {

  const [vfdState, setVfdState] = useState({

  });

  useEffect(()=>{
    console.log('is flipping')
    flipSound();
  },[])

  let classes = ["VirtualFlipDot"];

  const dotSize = 30;

  const [flipSound] = useSound(
    flipSoundFile,
    { volume: 0.25 }
  );

  let buttonClick = () => {
    console.log('button clicked');
    flipSound();
  }

  let dots = [];
  for( let x = 0; x < 10; x++ ){
    for (let y = 0; y < 7; y++){

      const array = [true,false];
       const randomElement = array[Math.floor(Math.random() * array.length)];

      let dot = <VFDDot
        size={dotSize}
        key={'FlipDot-'+x+'-'+y}
        passKey={'FlipDot-'+x+'-'+y}
        x={x}
        y={y}
        isFlipped={randomElement} />
      dots.push(dot)
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



