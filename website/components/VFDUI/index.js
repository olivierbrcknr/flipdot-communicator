import React, {useEffect, useState} from 'react';

import styles from './VFDUI.module.css';

import VirtualFlipDot from '../VirtualFlipDot'
import Toggle from '../Toggle'
import StyledButton from '../StyledButton'
import MatrixDraw from '../MatrixDraw'

import {icons} from '../VirtualFlipDot/icons.js'
import {messagesDB,firebaseDB} from '../utils/firestore'

let typeSelectorOptions = [
  {
    val: 'physical',
    isSelectable: true,
    description: 'Sends your message to all website instances and the hardware prototype'
  },
  {
    val: 'virtual',
    isSelectable: true,
    description: 'Sends your message to all website instances'
  },
  {
    val: 'test',
    isSelectable: true,
    description: 'Sends your message just to your website instance'
  }
];

const uiOptions = [
  {
    val: 'basic',
    isSelectable: true,
  },
  {
    val: 'draw',
    isSelectable: true,
  }
];


const VFDUI = (props) => {

  const [comState,setComState] = useState({
    sendType: 2,
    uiType: 0,
    showFlipDot: true,
    message: {
      type: 'StartUp',
      content: false,
    },
    isNewMessage: false
  });

  let classes = [styles.VFDUI];

  let sendMessage = (type,msg) => {

    let msgType = type; //false;
    let msgContent = (msg ? msg : false);

    if( msgType === "array" ){
      if( msgContent === false ){
        msgContent = [
          0,0,0,0,0,0,0,0,0,0,
          0,0,1,0,0,0,0,0,0,0,
          0,1,0,1,0,0,0,0,0,0,
          0,0,1,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0
        ];
      }else{
        msgContent = msgContent.map( (i) => {
          return ( i ? 1 : 0 );
        });
      }

      msgContent = msgContent.join('');
    }

    if( msgType === "icon" ){
      msgType = "array";
      msgContent = icons[msg];
      msgContent = msgContent.join('');
    }

    if(msgType){
      setComState({
        ...comState,
        message: {
          type: msgType,
          content: msgContent
        },
        isNewMessage: true
      })
    }
  }

  useEffect(()=>{
    if( comState.isNewMessage ){
      // set isNewMessage to false again
      setComState({
        ...comState,
        isNewMessage: false
      });

      let prototypeVariant = typeSelectorOptions[comState.sendType].val;

      // send message to DB only if needs to be send
      if( prototypeVariant === 'virtual' || prototypeVariant === 'physical' ){

        let timeStamp = new Date().getTime();

        firebaseDB.ref('flipMessages/'+prototypeVariant+'/').push({
          _timeStamp: timeStamp,
          ...comState.message
        }).then( () => {
          console.log(`✉️ Sent message ${comState.message.type}`);
        });
      }
    }

  }, [comState]);

  useEffect( () => {
    // prevent selection of 'physical if too many messages'
    firebaseDB.ref('flipMessages/physical').on('value', (snapshot) => {
      let size = snapshot.numChildren();
      // console.log( 'number of physical messages', size );
      if( size > 70){
        console.log('sorry, there are too many messages on the device already');
        typeSelectorOptions[0].isSelectable = false;
        setComState({
          ...comState,
          sendType: 2
        });
      }else{
        typeSelectorOptions[0].isSelectable = true;
        setComState(comState);
      }
    });

  }, [] );

  let MainUI = null;

  switch( comState.uiType ){
    case 1:

      MainUI = <MatrixDraw callback={ (matrix) => { sendMessage('array',matrix); } } />;

      break;
    default:
    case 0:

      MainUI = [];

      MainUI.push(<StyledButton onClick={ ()=>{ sendMessage('hello'); } }>
                    Send "Hello World"
                  </StyledButton>);
      MainUI.push(<StyledButton onClick={ ()=>{ sendMessage('icon','cup'); } }>
                    Ask For Coffee [Icon]
                  </StyledButton>);
      MainUI.push(<StyledButton onClick={ ()=>{ sendMessage('motion','stars'); } }>
                    Send Stars [Anim]
                  </StyledButton>);
      MainUI.push(<StyledButton onClick={ ()=>{ sendMessage('timer'); } }>
                    Start Timer [3 min]
                  </StyledButton>);
      // MainUI.push(<StyledButton onClick={ ()=>{ sendMessage('array'); } }>
      //               Send Array Test [Array]
      //             </StyledButton>);
      break;
  }

  let vfdContainer = null
  if( props.winWidth > 750 ){
    vfdContainer = (
      <div className={styles.FlipDotContainer}>
        <VirtualFlipDot
          comState={comState} />
      </div>
    );
  }

  return(
    <div className={classes.join(' ')}>

      <div className={styles.InterfaceContainer}>

        <div className={styles.InterfaceContainerMainUI}>

          {MainUI}

          <div className={styles.InterfaceContainerMainUIToggle}>
            <Toggle
              options={uiOptions}
              value={uiOptions[comState.uiType].val}
              callback={ (val) => setComState({
                ...comState,
                uiType: val
              }) } />
          </div>

        </div>

        <div className={styles.InterfaceContainerTypeToggle}>
          <Toggle
            options={typeSelectorOptions}
            value={typeSelectorOptions[comState.sendType].val}
            displayDescriptions
            callback={ (val) => setComState({
              ...comState,
              sendType: val
            }) } />
        </div>

      </div>

      {vfdContainer}

    </div>
  )
}

export default VFDUI



