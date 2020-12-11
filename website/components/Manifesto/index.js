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

        <div className={styles.ManifestoImageContainer}>

          <img src="/01.jpg" style={{width: '45%', alignSelf: 'flex-start'}} />
          <img src="/02.jpg" style={{alignSelf: 'flex-end'}} />
          <img src="/03.jpg" style={{alignSelf: 'center'}} />

        </div>

        <p>
          A project by <a href="">Olivier Brückner</a> &copy; 2020. Made in the class <a href="https://courses.newschool.edu/courses/PGTE5200/1588/">Major Studio 1</a> by <a href="http://www.salome.zone/">Salome Asega</a> and <a href="https://americanartist.us/">American Artist</a> in the program <a href="https://www.newschool.edu/parsons/mfa-design-technology/">MFA Design & Technology</a> at Parsons School of Design.
        </p>
        <p>
          Learn more about the project <a href="https://olivierbrcknr.github.io/mfadt-ms1-blog/">-> here</a>
        </p>

      </div>

      <div className={styles.Title}>
        Flip Dot Communicator ———— About
      </div>
    </div>
  )
}

export default Manifesto



