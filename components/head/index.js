import React, {useState, useEffect} from 'react'
import NextHead from 'next/head'
import { string } from 'prop-types'

// CSS
import "./reset.css"
import "./variables.css"
import "./index.css"

const Head = props => {

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>Distant Socializing</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/*
        <link rel="icon" sizes="192x192" href="/touch-icon.png" />
        <link rel="apple-touch-icon" href="/touch-icon.png" />
        <link rel="mask-icon" href={favIcon} color="#000000" />
        <link rel="icon" href={favIcon} />
      */}

    </NextHead>
  )
}

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
}

export default Head
