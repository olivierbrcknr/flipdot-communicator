// React
import React, { useEffect, useState, useRef } from 'react'

// Next
import Link from 'next/link'

// Components
import Head from '../components/Head'
import Footer from '../components/Footer'
import VirtualFlipDot from '../components/VirtualFlipDot'

import Toggle from '../components/Toggle'
import StyledButton from '../components/StyledButton'

// import {messagesDB,firestore} from '../components/utils/firestore'

const Home = () => {

  const [comState,setComState] = useState({
    sendType: 'virtual',
    showFlipDot: true
  });

  let classes = [];

  console.log()

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />
      {/*<Nav />*/}

      <div id="wrapper">

        <div id="mainContent">
          <div className="InterfaceContainer">

            <div className="InterfaceContainer-MainUI">
              <StyledButton>
                Send "Hello"
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

      </div>

    </div>
  )
}

export default Home
