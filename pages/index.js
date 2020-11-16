// React
import React, { useEffect, useState, useRef } from 'react'

// Next
import Link from 'next/link'

// Components
import Head from '../components/head'
import Footer from '../components/footer'

import {messagesDB,firestore} from '../components/utils/firestore'

const Home = () => {

  let classes = [];

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />
      {/*<Nav />*/}

      <div id="wrapper">

      </div>

    </div>
  )
}

export default Home
