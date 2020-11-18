import React from 'react'
import Link from 'next/link'

import './footer.css';

const Footer = (props) => {

  return (
    <footer className={props.className}>
      A project by <a href="https://olivierbrueckner.de/">Olivier Brückner</a>
    </footer>
  )
}

export default Footer
