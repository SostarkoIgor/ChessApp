import React from "react"
import styles from '../styles/square.module.css'
import { Chess } from 'chess.js'
import Piece from './Piece'


interface SquareProps {
  row: number, col: number, chess: Chess, piece: string, onClick: (row: number, col: number) => void
}
const Square : React.FC<SquareProps> = ({row, col, chess, piece, onClick}) => {
  const [sRow, setSRow] = React.useState<number>(row)
  const [sCol, setSCol] = React.useState<number>(col)

  return (
    <div className={`${styles.square} ${(row+col) % 2 === 0 ? styles.light : styles.dark}`} onClick={() => onClick(sRow, sCol)} >
      <Piece piece={piece} />
    </div>
  );
}

export default Square;