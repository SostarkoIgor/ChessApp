import React from "react"
import styles from '../styles/clock.module.css'

interface ClockProps { flipBoardAction: () => void, showLegalMovesAction: () => void, showNotationOnSquaresAction: () => void, automaticQueenAction: () => void,
                        promoteAutomaticallyToQueen: boolean, showLegalMoves: boolean, showNotationOnSquares: boolean
                    }
const Clock :React.FC<ClockProps> = ({flipBoardAction, showLegalMovesAction, showNotationOnSquaresAction, automaticQueenAction, promoteAutomaticallyToQueen, showLegalMoves, showNotationOnSquares}) => {
    return (
        <div className={styles.clock}>
            <div className={styles.time}>00<a className={styles.separator}>:</a>00</div>
            <div className={styles.clockBody}>
                <a className={styles.label}>Game options:</a>
                <div className={styles.options}>
                    <div className={`${styles.toggleOption} ${styles.resign}`}>Resign
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            flag_2
                        </span>
                    </div>
                </div>
                <a className={styles.label}>Board options:</a>
                <div className={styles.options}>
                    <div className={styles.toggleOption} onClick={showNotationOnSquaresAction}>
                        Show notation
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            {showNotationOnSquares ? "check_box" : "check_box_outline_blank"}
                        </span>
                    </div>
                    <div className={styles.toggleOption} onClick={showLegalMovesAction}>
                        Show legal moves
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            {showLegalMoves ? "check_box" : "check_box_outline_blank"}
                        </span>
                    </div>
                    <div className={styles.toggleOption} onClick={automaticQueenAction}>
                        Automatic to queen
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            {promoteAutomaticallyToQueen ? "check_box" : "check_box_outline_blank"}
                        </span>
                    </div>
                    <div className={styles.toggleOption} onClick={flipBoardAction}>
                        Flip board
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            autorenew
                        </span>
                    </div>
                </div>
                
            </div>
            <div className={styles.time}>00<a className={styles.separator}>:</a>00</div>
        </div>
    )
}

export default Clock