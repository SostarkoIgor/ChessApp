import React from "react"
import styles from '../styles/gameWidget.module.css'
import { time } from "console"

/*
component for the game widget
has start game button, that starts the game by setting isGameOngoing to true
we set time control in this widget
*/
interface GameWidgetProps {
    timeWhite: number,
    timeBlack: number,
    increment: number,
    isGameOngoing: boolean,
    setTimeWhite: (time: number) => void,
    setTimeBlack: (time: number) => void,
    setIncrement: (increment: number) => void,
    setIsGameOngoing: () => void
}
const GameWidget : React.FC<GameWidgetProps> = ({timeWhite, timeBlack, increment, isGameOngoing, setTimeWhite, setTimeBlack, setIncrement, setIsGameOngoing}) => {
    const [whiteTimeMins, setWhiteTimeMins] = React.useState<number>(Math.floor(timeWhite/60/1000)) //time of white player, only minutes, initially set to default value read from parent component (Board)
    const [whiteTimeSecs, setWhiteTimeSecs] = React.useState<number>(Math.floor((timeWhite/1000)%60)) //time of white - seconds, whiteTimeMins+whiteTimeSecs = total time a player has
    const [blackTimeMins, setBlackTimeMins] = React.useState<number>(Math.floor(timeBlack/60/1000)) //time of black player - minute component
    const [blackTimeSecs, setBlackTimeSecs] = React.useState<number>(Math.floor((timeBlack/1000)%60)) //time of black player - seconds component
    const [incrementSecs, setIncrementSecs] = React.useState<number>(increment/1000) //increment in seconds

    //function called when start game button is clicked
    //sets both players' time, increment and sets isGameOngoing to true
    const startGame = () => {
        setTimeWhite(whiteTimeMins*60*1000+whiteTimeSecs*1000)
        setTimeBlack(blackTimeMins*60*1000+blackTimeSecs*1000)
        setIncrement(incrementSecs*1000)
        setIsGameOngoing()
    }
    return (
        <div className={styles.gameWidget}>
            {!isGameOngoing &&
                <div className={styles.setGame}>
                        <div className={styles.timeInputContainer}>
                            Set time of white:
                            <div className={styles.timeInput}>
                                <input type="text" pattern="[0-9]*" inputMode="numeric" value={whiteTimeMins} onChange={(e) =>{e.target.value === "" ? setWhiteTimeMins(0) : setWhiteTimeMins(parseInt(e.target.value))}}/>:
                                <input type="text" pattern="[0-9]*" inputMode="numeric" value={whiteTimeSecs} onChange={(e) =>{e.target.value === "" ? setWhiteTimeSecs(0) : setWhiteTimeSecs(parseInt(e.target.value))}}/>
                            </div>

                            Set time of black:
                            <div className={styles.timeInput}>
                                <input type="text" pattern="[0-9]*" inputMode="numeric" value={blackTimeMins} onChange={(e) =>{e.target.value === "" ? setBlackTimeMins(0) : setBlackTimeMins(parseInt(e.target.value))}}/>:
                                <input type="text" pattern="[0-9]*" inputMode="numeric" value={blackTimeSecs} onChange={(e) =>{e.target.value === "" ? setBlackTimeSecs(0) : setBlackTimeSecs(parseInt(e.target.value))}}/>
                            </div>
                            Set increment:
                            <div className={styles.timeInput}>
                                <input type="text" pattern="[0-9]*" inputMode="numeric" value={incrementSecs} onChange={(e) =>{e.target.value === "" ? setIncrementSecs(0) : setIncrementSecs(parseInt(e.target.value))}}/>
                            </div>
                            
                        </div>
                        <button className={styles.startButton} onClick={startGame}>Start game</button>
                </div>
            }
            
        </div>
    )
}

export default GameWidget