import React from 'react'
import Square from './Square'

import styles from '../styles/board.module.css'
import { Chess } from 'chess.js'
import Clock from './Clock'

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
  const [showNotationOnSquares, setShowNotationOnSquares] = React.useState<boolean>(true) //flag for showing notation on each square
  const [showLegalMoves, setShowLegalMoves] = React.useState<boolean>(true) //flag for showing legal moves of clicked piece
  const [promoteAutomaticallyToQueen, setPromoteAutomaticallyToQueen] = React.useState<boolean>(false) //flag for automatically promoting to queen without promotion selector
  const [showPromotionSelector, setShowPromotionSelector] = React.useState<boolean>(false) //flag for showing promotion selector

  const [pieceToPromoteTo, setPieceToPromoteTo] = React.useState<string>("") //when we promote a piece this is where we store user selection to what piece to promote
  const [promotionToMove, setPromotionToMove] = React.useState<string | null>(null) //when we promote a piece this is where we store move of promotion
  const [promotionFromMove, setPromotionFromMove] = React.useState<string | null>(null) //when we promote a piece this is where we store move of promotion

  const [lastClickedSquare, setLastClickedSquare] = React.useState<{row: number, col: number} | null>(null) //coordinates of last clicked square, we use it to make move

  const onClick = async (row: number, col: number) => {//function that gets called by square component when square is clicked
    if (isGameOver) return
    const square = {row: row, col: col}
    const squareNotation = toSquareNotation(row, col, boardRefColor) //we need square notation of clicked square to make a move
    const getSquare = chess.get(squareNotation) //we check if anything is on the square
    
    if (lastClickedSquare == null && getSquare) { //if no square was clicked before (or move was made on last click)
      let availableSquares = getAvailableSquares(chess, row, col, boardRefColor)
      if (availableSquares.length === 0) return
      setLastClickedSquare(square)
      setLegalMoves(availableSquares)
      return
    }
    else  {
      try{ //we try to make a move
        if (lastClickedSquare == null)  return //if nothing is selected we can't make a move
        if (!legalMoves.includes(squareNotation)){ //if we try to move to a illegal square
          if (pieceOnSquare(chess, row, col, boardRefColor) === "" || getAvailableSquares(chess, row, col, boardRefColor).length === 0 || squareNotation === toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor)){ //if we try to move to empty square or square without legal moves we unselect last square, no square is selected
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
          if (promoteAutomaticallyToQueen) //if we want to automatically promote to queen we don't show promotion selector
            move=chess.move({from: toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor), to: squareNotation, promotion: 'q'})
          else{ //otherwise we do
            //we show promotion selector
            setShowPromotionSelector(true)
            //we set promotionToMove and promotionFromMove, used in useEffect to make a move
            setPromotionToMove(squareNotation)
            setPromotionFromMove(toSquareNotation(lastClickedSquare?.row!, lastClickedSquare?.col!, boardRefColor))
          }
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

  //this is used for promotion
  //this is called when we select piece to promote to
  React.useEffect(() => {
    if (pieceToPromoteTo !== '' && promotionToMove) {
      chess.move({from: promotionFromMove!, to: promotionToMove, promotion: pieceToPromoteTo})
      setPieceToPromoteTo('')
      setPromotionToMove(null)
      setShowPromotionSelector(false)
      setWhiteMove(!whiteMove)
      if (chess.isGameOver()) setIsGameOver(true)
    }
  }, [pieceToPromoteTo, promotionToMove, promotionFromMove]);

  React.useEffect(() => {
    function start() { //we generate board and set pieces on squares
      const boardTemp = []
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          //each square gets its key (its number), row and column number, info if it's highlighted (is legal to move selected piece on it), its notation etc.
          boardTemp.push(
            <Square key={i * 8 + j} row={i} col={j} chess={chess} 
                    piece={pieceOnSquare(chess, i, j, boardRefColor)} 
                    onClick={onClick} isHighlighted={showLegalMoves? legalMoves.includes(toSquareNotation(i, j, boardRefColor)) : false}
                    isClicked={lastClickedSquare?.row === i && lastClickedSquare?.col === j} notation={showNotationOnSquares? toSquareNotation(i, j, boardRefColor) : ""}/>

          )
        }
      }
      setBoard(boardTemp)
    }
    start()
  }, [chess, whiteMove, lastClickedSquare, boardRefColor, showNotationOnSquares, showLegalMoves, legalMoves]);

 

  if (!board || board.length === 0) {
    return <></>
  }
  return (
    <div className={styles.boardContainer}>
      <div></div>
      <div className={styles.board}>
        {board}
        <div className={styles.promotionPickerContainer} style={{visibility: showPromotionSelector ? 'visible' : 'hidden'}} onClick={() => setShowPromotionSelector(false)}>
          <div className={styles.promotionPicker}>
            <a className={styles.promotionHeader}>Promote to:</a>
            {chess.turn() === "w" &&
            <>
              <Square row={0} col={1} chess={chess} piece="qw" onClick={()=>{setPieceToPromoteTo("q")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={0} col={2} chess={chess} piece="rw" onClick={()=>{setPieceToPromoteTo("r")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={0} col={3} chess={chess} piece="bw" onClick={()=>{setPieceToPromoteTo("b")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={0} col={4} chess={chess} piece="nw" onClick={()=>{setPieceToPromoteTo("n")}} isHighlighted={false} isClicked={false} notation=""/>
            </>
            }
            {chess.turn() === "b" &&
            <>
              <Square row={7} col={1} chess={chess} piece="qb" onClick={()=>{setPieceToPromoteTo("q")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={7} col={2} chess={chess} piece="rb" onClick={()=>{setPieceToPromoteTo("r")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={7} col={3} chess={chess} piece="bb" onClick={()=>{setPieceToPromoteTo("b")}} isHighlighted={false} isClicked={false} notation=""/>
              <Square row={7} col={4} chess={chess} piece="nb" onClick={()=>{setPieceToPromoteTo("n")}} isHighlighted={false} isClicked={false} notation=""/>
            </>
            }
          </div>
        </div>
      </div>
      <Clock
        flipBoardAction={()=>{(boardRefColor === "white")? setboardRefColor("black") : setboardRefColor("white")}} 
        showLegalMovesAction={()=>{setShowLegalMoves(!showLegalMoves)}} 
        showNotationOnSquaresAction={()=>{setShowNotationOnSquares(!showNotationOnSquares)}} 
        automaticQueenAction={()=>{setPromoteAutomaticallyToQueen(!promoteAutomaticallyToQueen)}}
        promoteAutomaticallyToQueen={promoteAutomaticallyToQueen}
        showLegalMoves={showLegalMoves}
        showNotationOnSquares={showNotationOnSquares}
      />
    </div>
  )
}

export default Board;