// React
import React, { useEffect, useState } from 'react'

// Next
import Link from 'next/link'

// Components
import Head from '../components/head'
import Footer from '../components/footer'

import Manifesto from '../components/Manifesto'
import VFDUI from '../components/VFDUI'

const Home = () => {

  let classes = [];

  const [winWidth,setWinWidth] = useState(0);
  const [isManifesto,setIsManifesto] = useState(false);

  useEffect( ()=>{
    let updateWindowDimensions = () => {
      let windowWidth = window.innerWidth;
      setWinWidth(windowWidth)
    }
    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return( ()=>{
      window.removeEventListener('resize', updateWindowDimensions);
    })
  }, []);

  let manifestoDisplay = null;

  if(isManifesto){
    classes.push('isDisplayingManifesto');
    manifestoDisplay = <Manifesto />;
  }

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />
      {/*<Nav />*/}

      <div id="wrapper">

        <VFDUI winWidth={winWidth} />

        {manifestoDisplay}

        <div className="PageTitle">
          Flip Dot Communicator ———— Distant Socializing
        </div>

        <div className="ToggleManifesto" onClick={ ()=>{ setIsManifesto(!isManifesto) } }>
          { isManifesto ? 'Hide' : 'Manifesto' }
        </div>

        <Footer />

      </div>

    </div>
  )
}

export default Home
