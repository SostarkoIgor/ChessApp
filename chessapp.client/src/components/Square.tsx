import React from "react"
import styles from '../styles/square.module.css'
import { Chess } from 'chess.js'
import Piece from './Piece'


interface SquareProps {
  row: number, col: number, chess: Chess, piece: string, onClick: (row: number, col: number) => void, isHighlighted: boolean, isClicked: boolean
}
const Square : React.FC<SquareProps> = ({row, col, chess, piece, onClick, isHighlighted, isClicked}) => {
  const [sRow, setSRow] = React.useState<number>(row)
  const [sCol, setSCol] = React.useState<number>(col)

  return (
    <div className={`${styles.square} ${(row+col) % 2 === 0 ? styles.light : styles.dark} ${isClicked ? styles.clicked : ''}`} onClick={() => onClick(sRow, sCol)} >
      <Piece piece={piece} />
      {isHighlighted && <div className={styles.highlight}></div>}
    </div>
  );
}

export default Square;