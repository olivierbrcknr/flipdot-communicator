import React from 'react'
import Link from 'next/link'

import './footer.css';

const Footer = (props) => {

  return (
    <footer className={props.className}>
      2020 © A project by <a href="https://olivierbrueckner.de/">Olivier Brückner</a> — <a href="https://github.com/olivierbrcknr/flipdot-communicator">GitHub Repository</a>
    </footer>
  )
}

export default Footer
