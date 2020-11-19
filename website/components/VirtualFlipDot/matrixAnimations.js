

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

export {startupAnimation,sweepAnimation,displayQueue}
