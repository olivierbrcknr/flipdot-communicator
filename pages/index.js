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

// import {messagesDB,firestore} from '../components/utils/firestore'

const Home = () => {

  const [comState,setComState] = useState({
    sendType: 'virtual',
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
      })
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
                options={['physical','virtual','test']}
                value={comState.sendType}
                callback={ (val) => setComState({
                  ...comState,
                  sendType: val
                }) } />
              {/*<div className="description">
                physical – Sends your message to all website instances and the hardware prototype<br/>
                virtual — Sends your message to all website instances<br/>
                test — Sends your message just to your website instance
              </div>*/}
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
