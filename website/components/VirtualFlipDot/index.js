import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';

import VFDDot from '../VFDDot'
import { startupAnimation, sweepAnimation, displayQueue } from './matrixAnimations.js'

import styles from './VirtualFlipDot.module.css';

// source https://freesound.org/people/joedeshon/sounds/119415/
import flipSoundFile from './flip.mp3'

import {messagesDB} from '../utils/firestore'

const columns = 10;
const rows = 7;

const VirtualFlipDot = (props) => {

  const [vfdState, setVfdState] = useState({
    message: {
      type: 'StartUp',
      content: null,
    },
    matrix: new Array(columns*rows).fill(false),
    isAnimating: false,
    queue: [],
    alreadyDisplayedIDs: []
  });

  const [buttonWasPressed, setButtonWasPressed] = useState(false);

  useEffect(()=>{
    // only immedately display it if is in testing mode
    if( props.comState.isNewMessage && props.comState.sendType === 2 ){
      setVfdState({
        ...vfdState,
        message: props.comState.message
      });
    }
  },[props.comState])

  // init firebase listener
  useEffect( () => {
    let observer = messagesDB.onSnapshot(snapshot => {
      let newQueue = [];
      snapshot.forEach(doc => {
        // only show files that are newer than 10 minutes
        if( doc.data().Date ){
          let diffTime = 60*10; // 10 minutes in sec
          let now = new Date().getTime() / 1000;
          let prevDate = doc.data().Date.seconds;
          if( prevDate > now-diffTime &&
              vfdState.alreadyDisplayedIDs.indexOf(doc.id) <= -1){
            let newMsg = {
              ...doc.data(),
              id: doc.id
            }
            newQueue.push(newMsg)
          }
        }
      });
      setVfdState({
        ...vfdState,
        queue: newQueue
      })
    });
  }, [] )

  useEffect(()=>{
    console.log('new message displaying');
    playAnimation( vfdState.message.type, vfdState.message.content );
  },[vfdState.message])

  useEffect(() => {
    console.log('queue changed: ',vfdState.queue.length);
    if( !vfdState.isAnimating ){
      let newMatrix = displayQueue(vfdState.queue.length);
      setVfdState({
        ...vfdState,
        matrix: newMatrix, // display number of messages
        message: { // delete currently displayed message
          type: null,
          content: null
        }
      });
    }
  },[vfdState.queue,vfdState.isAnimating])

  useEffect(()=>{
    flipSound();
  },[vfdState.matrix])

  let classes = [styles.VirtualFlipDot];

  const dotSize = 30;

  const [flipSound] = useSound(
    flipSoundFile,
    { volume: 0.1 }
  );

  let buttonClick = () => {
    console.log('button clicked');
    setButtonWasPressed(true);
    if( vfdState.queue.length > 0 && !vfdState.isAnimating ){
      let newQueue = vfdState.queue;
      let firstMessage = newQueue.shift();
      let newIDs = vfdState.alreadyDisplayedIDs;
      newIDs.push(firstMessage.id);
      setVfdState({
        ...vfdState,
        message: firstMessage,
        queue: newQueue,
        alreadyDisplayedIDs: newIDs
      });
    }else{
      console.log('sorry, your queue is empty 🤷‍♂️')
    }
  }

  // callback function for animations
  let setMatrix = ( mtrx , isDone ) => {
    let newMatrix = vfdState.matrix;
    let isAnimating = true;

    if( mtrx ){
      newMatrix = mtrx;
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

      <div className={styles.VirtualFlipDotMatrix}>
        {dots}
      </div>

      <div
        onClick={ () => buttonClick() }
        className={styles.VirtualFlipDotButton}
        style={styleButton}>

        {buttonWasPressed ? null : <div className={styles.VirtualFlipDotButtonArrow}>← press me</div> }
      </div>

      <div className={styles.VirtualFlipDotCable}>

      </div>

    </div>
  )
}

export default VirtualFlipDot


