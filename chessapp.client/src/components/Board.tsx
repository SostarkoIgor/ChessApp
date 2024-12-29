import React from 'react'
import Square from './Square'
import Piece from './Piece'
import styles from '../styles/board.module.css'
const Board: React.FC = () => {

  const [board, setBoard] = React.useState<JSX.Element[] | null>(null)
  const [color, setColor] = React.useState('white')

  React.useEffect(() => {
    function start() {
      const boardTemp = []
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          boardTemp.push(<Square key={i*8+j} row={i} col={j}/>)
        }
      }
      setBoard(boardTemp)
    }
    start()
  }, [])

  if (!board) {
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