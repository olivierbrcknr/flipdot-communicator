// React
import React, { useEffect, useState, useRef } from 'react'

// Next
import Link from 'next/link'

// Components
import Head from '../components/head'
import Footer from '../components/footer'
import VirtualFlipDot from '../components/VirtualFlipDot'

import Toggle from '../components/Toggle'
import StyledButton from '../components/StyledButton'

import {messagesDB,firestore} from '../components/utils/firestore'

const typeSelectorOptions = [
  {
    val: 'physical',
    isSelectable: false,
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
]

const Home = () => {

  const [comState,setComState] = useState({
    sendType: 2,
    showFlipDot: true,
    message: {
      type: 'StartUp',
      content: false,
    },
    isNewMessage: false
  });

  let classes = [];

  let sendMessage = (type,msg) => {

    let msgType = false;
    let msgContent = false;

    switch (type){
      case 'hello':
        msgType = 'hello';
        break;
      default:
        console.log('Sorry, I did not understand that').
        break;
    }

    setComState({
      ...comState,
      message: {
        type: msgType,
        content: msgContent
      },
      isNewMessage: true
    })
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
        messagesDB.add({
          Date: new Date(),
          forType: prototypeVariant,
          isRead: false,
          ...comState.message
        }).then(ref => {
          console.log(`✉️ Sent message ${comState.message.type} with ID: ${ref.id}`);
        });
      }
    }
  }, [comState])

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />
      {/*<Nav />*/}

      <div id="wrapper">

        <div id="mainContent">
          <div className="InterfaceContainer">

            <div className="InterfaceContainer-MainUI">
              <StyledButton onClick={ ()=>{ sendMessage('hello'); } }>
                Send "Hello World"
              </StyledButton>
            </div>

            <div className="InterfaceContainer-TypeToggle">
              <Toggle
                options={typeSelectorOptions}
                value={typeSelectorOptions[comState.sendType].val}
                displayDescriptions
                callback={ (val) => setComState({
                  ...comState,
                  sendType: val
                }) } />
            </div>

            <div className="InterfaceContainer-Title">
              Flip Dot Communicator ———— Distant Socializing
            </div>



          </div>
          <div className="FlipDotContainer">
            <VirtualFlipDot
              comState={comState} />
          </div>
        </div>

        <Footer />

      </div>

    </div>
  )
}

export default Home