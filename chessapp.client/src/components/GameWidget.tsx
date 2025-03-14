import React from "react"
import styles from '../styles/gameWidget.module.css'
import { createGame, joinGame } from "../services/signalRService"

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
    isGameOver: boolean,
    isDraw: boolean,
    didWhiteWin: boolean,
    gameCode: string,
    setGameCode: (code: string) => void,
    setTimeWhite: (time: number) => void,
    setTimeBlack: (time: number) => void,
    setIncrement: (increment: number) => void,
    setIsGameOngoing: () => void,
    resetGame: () => void,
    setboardRefColor: (color: string) => void,
    setPlayerColor: (color: string) => void
}
const GameWidget : React.FC<GameWidgetProps> = (
    {timeWhite, timeBlack, increment, isGameOngoing,
        setTimeWhite, setTimeBlack, setIncrement, setIsGameOngoing,
        isGameOver, isDraw, didWhiteWin, resetGame, gameCode, setboardRefColor, setGameCode, setPlayerColor}
) => {
    const [whiteTimeMins, setWhiteTimeMins] = React.useState<number>(Math.floor(timeWhite/60/1000)) //time of white player, only minutes, initially set to default value read from parent component (Board)
    const [whiteTimeSecs, setWhiteTimeSecs] = React.useState<number>(Math.floor((timeWhite/1000)%60)) //time of white - seconds, whiteTimeMins+whiteTimeSecs = total time a player has
    const [blackTimeMins, setBlackTimeMins] = React.useState<number>(Math.floor(timeBlack/60/1000)) //time of black player - minute component
    const [blackTimeSecs, setBlackTimeSecs] = React.useState<number>(Math.floor((timeBlack/1000)%60)) //time of black player - seconds component
    const [incrementSecs, setIncrementSecs] = React.useState<number>(increment/1000) //increment in seconds
    const [color, setColor] = React.useState<string>('white')
    const [gameCodeInput, setGameCodeInput] = React.useState<string>('')

    //function called when start game button is clicked
    //sets both players' time, increment and sets isGameOngoing to true
    const startGame = () => {
        createGame(whiteTimeMins*60*1000+whiteTimeSecs*1000,blackTimeMins*60*1000+blackTimeSecs*1000,incrementSecs*1000, color === 'white')
        setTimeWhite(whiteTimeMins*60*1000+whiteTimeSecs*1000)
        setTimeBlack(blackTimeMins*60*1000+blackTimeSecs*1000)
        setIncrement(incrementSecs*1000)
        setboardRefColor(color)
        setPlayerColor(color)
        setIsGameOngoing()
    }
    const joinGameWithCode = () => {
        joinGame(gameCodeInput)
        setIsGameOngoing()
        setGameCode(gameCodeInput)
    }
    return (
        <div className={styles.gameWidget}>
            {!isGameOngoing && !isGameOver &&
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
                            Select your color:
                            <div className={styles.timeInput}>
                                <select value={color} onChange={(e) => {setColor(e.target.value)}}>
                                    <option value="white">White</option>
                                    <option value="black">Black</option>
                                </select>
                            </div>
                        </div>
                        <button className={styles.startButton} onClick={startGame}>Start game</button>
                        <div>
                            Or join game with code:
                            <input type="text" value={gameCodeInput} onChange={(e) => {setGameCodeInput(e.target.value)}}></input>
                            <button className={styles.startButton} onClick={joinGameWithCode}>Join game</button>
                        </div>
                </div>
            }
            {isGameOver && 
                <div className={styles.gameOver}>
                    {isDraw ? "Draw" : didWhiteWin ? "White won" : "Black won"}
                    <button className={styles.startButton} onClick={resetGame}>New game</button>
                </div>
            }
            {isGameOngoing && 
                <div className={styles.gameOngoing}>
                    Game ongoing, game code: {gameCode}
                </div>
            }
        </div>
    )
}

export default GameWidget