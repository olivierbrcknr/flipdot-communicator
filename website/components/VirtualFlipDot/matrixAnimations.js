
import {icons,animations} from './icons.js'

const columns = 10;
const rows = 7;

let startupAnimation = () => {

}

let sweepAnimation = ( setMatrix ) => {

  let printedColumns = 0;

  let printColumn = () => {

    let matrix = new Array(columns*rows).fill(false);
    let isDone = false;

    for (let i = 0; i < rows; i++) {
      matrix[i*columns+printedColumns] = true;
    }

    if( printedColumns < columns  ){
      setTimeout( printColumn, 100 );
    }else{
      matrix = new Array(columns*rows).fill(false);
      isDone = true;
    }

    setMatrix( matrix, isDone );
    printedColumns++;
  }
  printColumn();
}

let iconAnimation = ( setMatrix, icon ) => {

  let animFrame = 0;
  let maxFrames = animations[icon].length;

  let printFrame = () => {

    let matrix = new Array(columns*rows).fill(false);
    let isDone = false;
    matrix = animations[icon][animFrame];

    if( animFrame < maxFrames  ){
      setTimeout( printFrame, 100 );
    }else{
      matrix = new Array(columns*rows).fill(false);
      isDone = true;
    }

    setMatrix( matrix, isDone );
    animFrame++;
  }
  printFrame();
}

let displayQueue = (length) => {
  let matrix = new Array(columns*rows).fill(false);
  for ( let y = 0; y < rows; y++ ){
    for( let x = 0; x < columns; x++ ){
      let i = x + y*columns;
      let k = y + x*rows;

      matrix[i] = ( k < length ) ? true : false;
    }
  }
  return( matrix );
}

let displayIcon = (setMatrix,icon) => {
  let matrix = [];

  switch( icon ){
    case 'cup':
      matrix = icons.cup;
      break;
    default:
      // do nothing
      break;
  }

  if( matrix.length > 0 ){
    setMatrix( matrix, true );
  }else{
    console.log('sorry, nothing to display')
  }
}

let displayArray = (setMatrix,arr) => {
  setMatrix( arr, true );
}

export {startupAnimation,sweepAnimation,displayQueue,displayIcon,iconAnimation,displayArray}
