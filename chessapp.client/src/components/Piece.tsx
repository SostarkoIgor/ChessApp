import React from 'react'
import styles from '../styles/piece.module.css'
import pw from '../assets/pieces/pawn-w.svg'
import pb from '../assets/pieces/pawn-b.svg'
import rw from '../assets/pieces/rook-w.svg'
import rb from '../assets/pieces/rook-b.svg'
import bw from '../assets/pieces/bishop-w.svg'
import bb from '../assets/pieces/bishop-b.svg'
import nw from '../assets/pieces/knight-w.svg'
import nb from '../assets/pieces/knight-b.svg'
import qw from '../assets/pieces/queen-w.svg'
import qb from '../assets/pieces/queen-b.svg'
import kw from '../assets/pieces/king-w.svg'
import kb from '../assets/pieces/king-b.svg'
const Piece: React.FC<{piece: string}> = ({piece}) => {
  const pieceSVG : {[key: string]: string} ={//all svgs are stored here
    "pw": pw,
    "pb": pb,
    "rw": rw,
    "rb": rb,
    "bw": bw,
    "bb": bb,
    "nw": nw,
    "nb": nb,
    "qw": qw,
    "qb": qb,
    "kw": kw,
    "kb": kb,
    "": ""
  }
  return (
    <>
    {piece !== "" && 
      <img className={styles.piece} src={pieceSVG[piece]} draggable={true}/>
    }
    </>
  )
}

export default Piece