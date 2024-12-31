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

//converts square notation to row and col
const fromSquareNotation = (notation: string, color: string): { row: number; col: number } => {
  const column = notation[0]
  const rowNotation = parseInt(notation[1])

  if (color === 'white') {
    const col = column.charCodeAt(0) - 'a'.charCodeAt(0)
    const row = 8 - rowNotation
    return { row, col }
  } else {
    const col = 7 - (column.charCodeAt(0) - 'a'.charCodeAt(0))
    const row = rowNotation - 1
    return { row, col }
  }
}

//get available squares for a piece
const getAvailableSquares = (chess: Chess, row: number, col: number, boardRefColor: string) => {
  let square = toSquareNotation(row, col, boardRefColor) 
  return chess.moves({square: square, verbose: true}).map(m=>m.to)
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
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false)
  const [legalMoves, setLegalMoves] = React.useState<string[]>([]) //legal moves of selected piece

  const [lastClickedSquare, setLastClickedSquare] = React.useState<{row: number, col: number} | null>(null) //coordinates of last clicked square, we use it to make move

  const onClick = (row: number, col: number) => {//function that gets called by square component when square is clicked
    if (isGameOver) return
    const square = {row: row, col: col}
    const squareNotation = toSquareNotation(row, col, boardRefColor) //we need square notation to make a move
    const getSquare = chess.get(squareNotation) //we check if anything is on the square
    
    if (lastClickedSquare == null && getSquare) { //if no square was clicked before (or move was made on last click)
      let availableSquares = getAvailableSquares(chess, row, col, boardRefColor)
      setLegalMoves(availableSquares)
      if (availableSquares.length === 0) return
      setLastClickedSquare(square)
      return
    }
    else  {
      try{ //we try to make a move
        if (lastClickedSquare == null)  return //if nothing is selected we can't make a move
        if (!legalMoves.includes(squareNotation)){ //if we try to move to a illegal square
          if (pieceOnSquare(chess, row, col, boardRefColor) === ""){ //if we try to move to empty square we unselect last square, no square is selected
            setLegalMoves([])
            setLastClickedSquare(null)
            return
          }

          //otherwise we select last clicked square instead of previously selected, we select it only if it has legal moves
          let availableSquares = getAvailableSquares(chess, row, col, boardRefColor)
          setLegalMoves(availableSquares)
          if (availableSquares.length === 0) return
          setLastClickedSquare(square)
          return
        }
        let pieceToMove = pieceOnSquare(chess, lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor) //we get piece that player is trying to move, used to check for promotion
        let move : any = false

        //we handle promotion scenario
        if (pieceToMove === "pw" && squareNotation.charAt(1) === '8' || pieceToMove === "pb" && squareNotation.charAt(1) === '1') {
          move=chess.move({from: toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor), to: squareNotation, promotion: 'q'})
        }
        else{
          move=chess.move({from: toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor), to: squareNotation})
        }
        if (move){
          setWhiteMove(!whiteMove) //we change whose move it is, this is mainly here for useEffect rendering
          if (chess.isGameOver()){
            setIsGameOver(true)
          }
        }
      }
      catch(e){ //if move is invalid
        console.log(e)
      }
      setLegalMoves([])
      setLastClickedSquare(null)
      return
    }
  }

  React.useEffect(() => {
    function start() { //we generate board and set pieces on squares
      const boardTemp = []
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardTemp.push(
            <Square key={i * 8 + j} row={i} col={j} chess={chess} 
                    piece={pieceOnSquare(chess, i, j, boardRefColor)} 
                    onClick={onClick} isHighlighted={legalMoves.includes(toSquareNotation(i, j, boardRefColor))}
                    isClicked={lastClickedSquare?.row === i && lastClickedSquare?.col === j}/>
          )
        }
      }
      setBoard(boardTemp)
    }
    start()
  }, [chess, whiteMove, lastClickedSquare])

 

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