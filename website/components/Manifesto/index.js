import React, {useEffect} from 'react';
import ReactMarkdown from 'react-markdown'
import ReactHtmlParser from 'react-html-parser';

import styles from './Manifesto.module.css';
import manifesto from './manifesto.md'


const Manifesto = (props) => {

  let classes = [styles.Manifesto];

  let textParser = (props) => {
    const val = props.value;

    // find strike through
    let evenOdd = 'odd';
    if( val.indexOf("~") === 0 ){
      evenOdd = 'even';
    }
    let text = val.split('~~');

    let elements = text.map( (sub, i) => {
      let element = sub;
      if( i-1 % 2 == 0 ){
        element = `<span class="${styles.strikeThrough}">${sub}</span>`;
      }
      return(element)
    } )
    text = elements.join("");
    return ReactHtmlParser(text);
  }

  return(
    <div className={classes.join(' ')}>
      <div className={styles.ManifestoText}>
        <ReactMarkdown
          virtualHtml={true}
          renderers={{
            text: textParser
          }}
          children={manifesto} />
      </div>

      <div className={styles.Title}>
        Flip Dot Communicator ———— Manifesto
      </div>
    </div>
  )
}

export default Manifesto



