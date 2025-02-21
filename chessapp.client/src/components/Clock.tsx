import React from "react"
import styles from '../styles/clock.module.css'

/*
component for the clock
shows time each player has and options for the board (flip board, show notation, show legal moves, automatic promotion to queen)
has game options (resign game)

component takes in props:
flipBoardAction: function to flip the board
showLegalMovesAction: function to set if legal moves of selected piece should be shown
showNotationOnSquaresAction: function to show notation on squares
automaticQueenAction: function to automatically promote to queen
corresponding state variables: promoteAutomaticallyToQueen, showLegalMoves, showNotationOnSquares
and time variables timeWhite, timeBlack, increment
and state variable isGameOngoing that indicates if the game is ongoing
*/
interface ClockProps { flipBoardAction: () => void, showLegalMovesAction: () => void, showNotationOnSquaresAction: () => void, automaticQueenAction: () => void,
                        promoteAutomaticallyToQueen: boolean, showLegalMoves: boolean, showNotationOnSquares: boolean,
                        timeWhite: number, timeBlack: number, increment: number, isGameOngoing: boolean
                    }
const Clock :React.FC<ClockProps> = ({flipBoardAction, showLegalMovesAction, showNotationOnSquaresAction, automaticQueenAction,
    promoteAutomaticallyToQueen, showLegalMoves, showNotationOnSquares, timeWhite, timeBlack, increment, isGameOngoing}) => {
    const formatTime = (time: number) => {
        return time.toString().padStart(2, '0')
    }
    return (
        <div className={styles.clock}>
            <div className={styles.time}>{formatTime(Math.floor(timeWhite/60/1000))}<a className={styles.separator}>:</a>{formatTime(Math.floor((timeWhite/1000)%60))}</div>
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
                        Automatic promotion to queen
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
            <div className={styles.time}>{formatTime(Math.floor(timeBlack/60/1000))}<a className={styles.separator}>:</a>{formatTime(Math.floor((timeBlack/1000)%60))}</div>
        </div>
    )
}

export default Clock