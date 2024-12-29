import React from "react"
import styles from '../styles/square.module.css'

const Square : React.FC<{row: number, col: number}> = ({row, col}) => {
  return (
    <div className={`${styles.square} ${(row+col) % 2 === 0 ? styles.light : styles.dark}`}>
    </div>
  );
}

export default Square;