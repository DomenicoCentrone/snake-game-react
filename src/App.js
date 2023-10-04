// App.js
import React, { useState } from 'react';
import SnakeGame from './SnakeGame';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="game-container">
      {!gameStarted && <div style={{textAlign: 'center'}}><h1>Snake Game React</h1><button className='gameButton' onClick={() => setGameStarted(true)}>Start</button></div>}
      {gameStarted && <SnakeGame />}
    </div>
  );
}

export default App;
