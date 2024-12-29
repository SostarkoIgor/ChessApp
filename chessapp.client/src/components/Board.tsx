import React from 'react'
import Square from './Square'

import styles from '../styles/board.module.css'
import { Chess } from 'chess.js'
import { get } from 'http'

//converts row and col to square notation, for example toSquareNotation(0, 0, 'white') returns 'a1'
const toSquareNotation = (row: number, col: number, color: string) : string => {
  const column = String.fromCharCode(col + 'a'.charCodeAt(0));
  const rowNotation = 8 - row;
  if (color === 'white') {
    return column + rowNotation;
  } 
  else { //if color of player is black, adjust square notation
    const mirroredColumn = String.fromCharCode(7 - col + 'a'.charCodeAt(0));
    return mirroredColumn + (9-rowNotation);
  }
}

//gets the piece on the square in format pw, pb, rw, rb, etc, where first letter denominates piece and second letter denotes color
const pieceOnSquare = (chess: Chess, row: number, col: number, color: string) => {
  let square = toSquareNotation(row, col, color)
  let piece = chess.get(square)
  if (!piece) return ""
  return piece.type + piece.color
}
const Board: React.FC = () => {

  const [chess, setChess] = React.useState<Chess>(new Chess()) //chess object for board
  const [board, setBoard] = React.useState<JSX.Element[] | null>([]) //array of squares
  const [boardRefColor, setboardRefColor] = React.useState<string>('white') //reference color of board, if white bottom row is A
  const [whiteMove, setWhiteMove] = React.useState<boolean>(true) //whose turn it is

  let lastClickedSquare: {row: number, col: number} | null =  null//coordinates of last clicked square, we use it to make move

  const onClick = (row: number, col: number) => {//function that gets called by square component when square is clicked
    const square = {row: row, col: col}
    const squareNotation = toSquareNotation(row, col, boardRefColor) //we need square notation to make a move
    const getSquare = chess.get(squareNotation) //we check if anything is on the square
    
    if (lastClickedSquare == null && getSquare) { //if no square was clicked before (or move was made on last click)
      lastClickedSquare = square
      return
    }
    else  {
      try{ //we try to make a move
        let move=chess.move({from: toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor), to: squareNotation})
        if (move){
          setWhiteMove(!whiteMove) //we change whose move it is, this is mainly here for useEffect rendering
        }
      }
      catch(e){ //if move is invalid
        console.log(e)
      }
      lastClickedSquare = null //we reset
      return
    }
  }

  React.useEffect(() => {
    function start() { //we generate board and set pieces on squares
      const boardTemp = []
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardTemp.push(<Square key={i * 8 + j} row={i} col={j} chess={chess} piece={pieceOnSquare(chess, i, j, boardRefColor)} onClick={onClick}/>)
        }
      }
      setBoard(boardTemp)
    }
    start()
  }, [chess, whiteMove])

 

  if (!board || board.length === 0) {
    return <></>
  }
  return (
    <>
      <div className={styles.board}>
        {board}
      </div>
    </>
  )
}

export default Board;