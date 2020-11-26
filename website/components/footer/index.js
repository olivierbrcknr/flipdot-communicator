import React from 'react'
import Link from 'next/link'

import styles from './footer.module.css';

const Footer = (props) => {

  return (
    <footer className={styles.Footer}>
      2020 © A project by <a href="https://olivierbrueckner.de/">Olivier Brückner</a> — <a href="https://github.com/olivierbrcknr/flipdot-communicator">GitHub Repository</a>
    </footer>
  )
}

export default Footer
