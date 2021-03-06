import React, { useEffect, useState } from 'react';
import useSound from 'use-sound';

import VFDDot from '../VFDDot'
import { startupAnimation, sweepAnimation, displayQueue, displayIcon, iconAnimation, displayArray, timerAnimation, stopTimerAnimation } from './matrixAnimations.js'

import styles from './VirtualFlipDot.module.css';

// source https://freesound.org/people/joedeshon/sounds/119415/
import flipSoundFile from './flip.mp3'

import {messagesDB,firebaseDB} from '../utils/firestore'

const columns = 10;
const rows = 7;

const VirtualFlipDot = (props) => {

  const [queue,setQueue] = useState([]);

  const [vfdState, setVfdState] = useState({
    message: {
      type: 'StartUp',
      content: null,
    },
    matrix: new Array(columns*rows).fill(false),
    isAnimating: false,
    isDisplayingMessage: false,
    isTimer: false,
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

    startupAnimation( setMatrix );

    //messagesDB.once('value').then((snapshot) => {
    messagesDB.on('value', (snapshot) => {
      const type = snapshot.val();

      let newQueue = [];
      let timerIsStarting = false;
      for( const y in type ){
        const data = type[y];

        for ( const x in data ){
          const doc = data[x];

          // only show files that are newer than 10 minutes
          // also physical ones should not be shown
          if( doc._timeStamp ){
            let diffTime = 60*10*1000; // 10 minutes in msec
            let now = new Date().getTime();
            if( doc._timeStamp > now-diffTime &&
                vfdState.alreadyDisplayedIDs.indexOf(x) <= -1){

              if( doc.type == 'timer' ){
                let diffTimeTimer = 5*1000;
                if( doc._timeStamp > now-diffTimeTimer ){
                  console.log('start Timer ⏱');
                  timerIsStarting = doc._timeStamp;
                  // delete this entry after two secons
                  setTimeout(()=>{
                    firebaseDB.ref('flipMessages/virtual/'+x).remove();
                  },2000);
                }
              }else{
                let newMsg = {
                  ...doc,
                  id: x
                }
                newQueue.push(newMsg)
              }
            }else if( doc.forType === 'virtual' ){
              // delete messages that are older
              // than 10 minutes and virtual
              firebaseDB.ref('flipMessages/virtual/'+x).remove();
            }
          }
        }
      }

      setQueue(newQueue)

      if( timerIsStarting ){
        startNewTimer();
      }

    });

    // better way to only listen to new elements
    // but react useState issue (for now)

    // messagesDB.on('child_added', function(message) {
    //   if (!newItems) return;
    //   var message = message.val();
    //   let newQueue = vfdState.queue;
    //   newQueue.push(message);
    //   setVfdState({
    //     ...vfdState,
    //     queue: newQueue
    //   })
    // });

  }, [] );

  useEffect(()=>{
    console.log('new message displaying');
    // log array for arduino use
    // let msgTest = vfdState.message.content
    // if( typeof msgTest === "string" ){
    //   let chars = msgTest.split('');
    //   chars = chars.map( i => parseInt(i) )
    //   console.log(chars)
    // }
    playAnimation( vfdState.message.type, vfdState.message.content );
  },[vfdState.message])

  useEffect(() => {
    console.log('queue changed: ',queue.length);
    if( !vfdState.isAnimating ){
      let newMatrix = displayQueue(queue.length);
      setVfdState({
        ...vfdState,
        matrix: newMatrix, // display number of messages
        message: { // delete currently displayed message
          type: null,
          content: null
        },
        isDisplayingMessage: false,
      });
    }
  },[queue,vfdState.isAnimating])

  useEffect(()=>{
    flipSound();
  },[vfdState.matrix])

  useEffect(()=>{
    console.log('isTimer',vfdState.isTimer)
    if( vfdState.isTimer ){
      timerAnimation(setMatrix);
    }
  },[vfdState.isTimer])

  let startNewTimer = () => {
    if( vfdState.isTimer ){
      console.log('Timer is already running')
    }else{
      console.log('Start new timer')
      setVfdState({
        ...vfdState,
        isTimer: true
      });
    }
  }

  let classes = [styles.VirtualFlipDot];

  const dotSize = 30;

  const [flipSound] = useSound(
    flipSoundFile,
    { volume: 0.1 }
  );

  let buttonClick = () => {
    console.log('button clicked');
    setButtonWasPressed(true);

    if( vfdState.isTimer ){
      stopTimerAnimation( setMatrix );
      let newMatrix = displayQueue(queue.length);
      setVfdState({
        ...vfdState,
        matrix: newMatrix,
        isTimer: false,
        isAnimating: false
      });
    } else if( vfdState.isDisplayingMessage ){

      let newMatrix = displayQueue(queue.length);
      setVfdState({
        ...vfdState,
        matrix: newMatrix, // display number of messages
        message: { // delete currently displayed message
          type: null,
          content: null
        },
        isDisplayingMessage: false
      });

    } else if( queue.length > 0 && !vfdState.isAnimating && !vfdState.isDisplayingMessage ){
      let newQueue = queue;
      let firstMessage = newQueue.shift();
      let newIDs = vfdState.alreadyDisplayedIDs;
      newIDs.push(firstMessage.id);
      setVfdState({
        ...vfdState,
        message: firstMessage,
        alreadyDisplayedIDs: newIDs,
        isDisplayingMessage: true
      });
      setQueue(newQueue);
    }else{
      console.log('sorry, your queue is empty 🤷‍♂️')
      displayIcon( setMatrix, "sad" );
      setTimeout( () => {
        setMatrix( new Array(columns*rows).fill(false) , true);
      }, 1500);
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
      isAnimating: isAnimating,
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
        case 'motion':
          iconAnimation( setMatrix, msg );
          animationStarting = true;
          break;
        case 'array':
          let arr = msg.split("");
          arr = arr.map( (x) => {return parseInt(x)} );
          displayArray( setMatrix, arr );
          animationStarting = true;
          break;
        case 'timer':
          setVfdState({
            ...vfdState,
            isTimer: true
          });
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



