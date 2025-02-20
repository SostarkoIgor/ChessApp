import React from "react"
import styles from '../styles/clock.module.css'

const Clock :React.FC = () => {
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
                    <div className={styles.toggleOption}>
                        Show notation
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            check_box
                        </span>
                    </div>
                    <div className={styles.toggleOption}>
                        Show legal moves
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            check_box
                        </span>
                    </div>
                    <div className={styles.toggleOption}>
                        Automatic to queen
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            check_box
                        </span>
                    </div>
                    <div className={styles.toggleOption}>
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