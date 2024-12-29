import { useEffect, useState } from 'react';
import './App.css';
import Board from './components/Board';

function App() {
    return (
        <>
            <div className='container'>
                <Board />
            </div>
        </>
    )
}

export default App;